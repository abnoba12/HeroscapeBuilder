import { AxiosError, AxiosResponse } from 'axios';
import AxiosSingletonService from '../AxiosSingletonService';
import { Unit } from '../../models/unit';
import { getUnitPoints, isPointSystem, PointSystem, DEFAULT_POINT_SYSTEM } from '../../models/point-system';
import {
    ArmyBuilder,
    ArmyBuilderSaveRequest,
    ArmyBuilderUnit,
    ArmyBuilderVariation,
    ArmyGame,
    ArmyGameRequest,
    ArmyTally,
    JournalEntry,
    JournalEntryRequest,
} from '../../models/armybuilder';
import { dbBulk, dbDelete, dbGet, dbGetAll, dbGetByIndex, dbPut, LOCAL_USER_ID } from './idb';
import { hasAccountFlag, LOGIN_REQUIRED_EVENT } from './local-account';
import {
    ArmyBuilderJournalRow,
    ArmyBuilderRow,
    ArmyBuilderUnitRow,
    ArmyGameRow,
    ArmyGameUnitRow,
    UserCardRow,
    UserTerrainRow,
} from './rows';

/**
 * The My Heroscape endpoints, answered from the browser's IndexedDB for visitors without an account.
 * Each function mirrors the server service of the same name (validation messages included) so the pages
 * behave the same either way.
 */

const MAX_NAME_LENGTH = 100;
const MAX_NOTES_LENGTH = 10000;
const MAX_JOURNAL_FIELD = 4000;
const MAX_JOURNAL_ENTRIES = 500;
const MAX_GAME_BATCH = 200;
const MAX_GAME_NOTE = 500;
const MAX_GAMES = 5000;
const RECENT_GAMES = 25;
const MAX_TERRAIN_QUANTITY = 10000;

// ---------- Errors and guards ----------

/** An error shaped like the server's, so getErrorMessages / isNotFound treat it the same. */
const fail = (status: number, ...errors: string[]): AxiosError => {
    const response = { status, statusText: '', headers: {}, config: {}, data: { errors } } as unknown as AxiosResponse;
    return new AxiosError(errors.join(' '), 'ERR_LOCAL', undefined, undefined, response);
};

const notFound = () => fail(404, 'Army not found.');

/** Refuses to save for a browser that belongs to someone with an account; they must log in instead. */
const assertWritable = async (): Promise<void> => {
    if (await hasAccountFlag()) {
        window.dispatchEvent(new Event(LOGIN_REQUIRED_EVENT));
        throw fail(403, 'You already have an account. Log in to save your changes so they are not lost.');
    }
};

const signUpToShare = () => fail(400, 'Sign up for an account to share an army.');

const nowIso = () => new Date().toISOString();

const newGuid = (): string =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.floor(Math.random() * 16);
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });

// ---------- Unit catalog ----------

let catalogPromise: Promise<Map<number, Unit>> | null = null;

const getCatalog = (): Promise<Map<number, Unit>> => {
    if (!catalogPromise) {
        catalogPromise = AxiosSingletonService.getInstance()
            .get<Unit[]>('/Unit/GetAllUnits')
            .then(response => new Map(response.data.map(unit => [unit.id, unit])));
        catalogPromise.catch(() => { catalogPromise = null; });
    }
    return catalogPromise;
};

const pointsFor = (unit: Unit | undefined, system: string): number =>
    getUnitPoints(unit, isPointSystem(system) ? system : DEFAULT_POINT_SYSTEM) ?? 0;

const byName = (a: Unit, b: Unit) => (a.name ?? '').localeCompare(b.name ?? '');

// ---------- My Collection ----------

const ownedQuantities = async (): Promise<Map<number, number>> => {
    const owned = new Map<number, number>();
    for (const row of await dbGetAll<UserCardRow>('user_cards')) {
        owned.set(row.OwnedArmyCard, (owned.get(row.OwnedArmyCard) ?? 0) + row.Quantity);
    }
    return owned;
};

export const localGetMyUnitCount = async (): Promise<number> => (await dbGetAll<UserCardRow>('user_cards')).length;

export const localGetMyUnits = async (): Promise<Unit[]> => {
    const catalog = await getCatalog();
    return (await dbGetAll<UserCardRow>('user_cards'))
        .map(row => {
            const unit = catalog.get(row.OwnedArmyCard);
            return unit ? { ...unit, quantity: row.Quantity } : null;
        })
        .filter((unit): unit is Unit & { quantity: number } => unit !== null)
        .sort(byName);
};

export const localAddUnits = async (unitIds: number[]): Promise<number> => {
    await assertWritable();
    const catalog = await getCatalog();
    const counts = new Map<number, number>();
    unitIds.forEach(id => counts.set(id, (counts.get(id) ?? 0) + 1));
    if ([...counts.keys()].some(id => !catalog.has(id))) throw fail(400, 'Unable to add all units');

    const existing = new Map((await dbGetAll<UserCardRow>('user_cards')).map(row => [row.OwnedArmyCard, row]));
    await dbBulk([...counts].map(([id, count]) => {
        const row = existing.get(id);
        return {
            store: 'user_cards' as const,
            put: row ? { ...row, Quantity: row.Quantity + count } : { UserId: LOCAL_USER_ID, OwnedArmyCard: id, Quantity: count },
        };
    }));
    return unitIds.length;
};

export const localDeleteUnits = async (unitIds: number[]): Promise<number> => {
    await assertWritable();
    const ids = new Set(unitIds);
    const rows = (await dbGetAll<UserCardRow>('user_cards')).filter(row => ids.has(row.OwnedArmyCard));
    await dbBulk(rows.map(row => ({ store: 'user_cards' as const, delete: row.id! })));
    return unitIds.length;
};

export const localSetMyUnits = async (units: Array<{ unitId: number; quantity: number }>): Promise<number> => {
    await assertWritable();
    const desired = new Map<number, number>();
    for (const unit of units) {
        if (unit.quantity > 0 && !desired.has(unit.unitId)) desired.set(unit.unitId, unit.quantity);
    }

    const ops: Parameters<typeof dbBulk>[0] = [];
    for (const row of await dbGetAll<UserCardRow>('user_cards')) {
        const quantity = desired.get(row.OwnedArmyCard);
        if (quantity === undefined) {
            ops.push({ store: 'user_cards', delete: row.id! });
        } else {
            desired.delete(row.OwnedArmyCard);
            ops.push({ store: 'user_cards', put: { ...row, Quantity: quantity } });
        }
    }
    desired.forEach((quantity, id) => ops.push({ store: 'user_cards', put: { UserId: LOCAL_USER_ID, OwnedArmyCard: id, Quantity: quantity } }));
    await dbBulk(ops);
    return ops.length;
};

// ---------- My Terrain ----------

export interface LocalTerrainItem {
    terrainTypeId: number;
    terrainSizeId: number;
    quantity: number;
}

export const localGetMyTerrain = async (): Promise<LocalTerrainItem[]> =>
    (await dbGetAll<UserTerrainRow>('user_terrain')).map(row => ({
        terrainTypeId: row.terrain_type_id,
        terrainSizeId: row.terrain_size_id,
        quantity: row.quantity,
    }));

export const localSetMyTerrain = async (terrain: LocalTerrainItem[]): Promise<LocalTerrainItem[]> => {
    await assertWritable();
    if (terrain.some(t => t.quantity < 0 || t.quantity > MAX_TERRAIN_QUANTITY)) {
        throw fail(400, 'Invalid terrain type, size or quantity.');
    }

    const desired = new Map<string, LocalTerrainItem>();
    for (const item of terrain) {
        const key = `${item.terrainTypeId}:${item.terrainSizeId}`;
        if (item.quantity > 0 && !desired.has(key)) desired.set(key, item);
    }

    const ops: Parameters<typeof dbBulk>[0] = [];
    for (const row of await dbGetAll<UserTerrainRow>('user_terrain')) {
        const key = `${row.terrain_type_id}:${row.terrain_size_id}`;
        const item = desired.get(key);
        if (!item) {
            ops.push({ store: 'user_terrain', delete: row.id! });
        } else {
            desired.delete(key);
            ops.push({ store: 'user_terrain', put: { ...row, quantity: item.quantity } });
        }
    }
    desired.forEach(item => ops.push({
        store: 'user_terrain',
        put: { user_id: LOCAL_USER_ID, terrain_type_id: item.terrainTypeId, terrain_size_id: item.terrainSizeId, quantity: item.quantity },
    }));
    await dbBulk(ops);
    return localGetMyTerrain();
};

// ---------- Armies ----------

interface Snapshot {
    armies: ArmyBuilderRow[];
    units: ArmyBuilderUnitRow[];
    games: ArmyGameRow[];
    owned: Map<number, number>;
    catalog: Map<number, Unit>;
}

const loadSnapshot = async (): Promise<Snapshot> => {
    const [armies, units, games, owned, catalog] = await Promise.all([
        dbGetAll<ArmyBuilderRow>('armybuilder'),
        dbGetAll<ArmyBuilderUnitRow>('armybuilder_unit'),
        dbGetAll<ArmyGameRow>('army_game'),
        ownedQuantities(),
        getCatalog(),
    ]);
    return { armies, units, games, owned, catalog };
};

const tallyOf = (snapshot: Snapshot, armyBuilderId: number): ArmyTally => {
    let wins = 0;
    let losses = 0;
    for (const game of snapshot.games) {
        if (game.ArmyBuilderId !== armyBuilderId) continue;
        if (game.Won) wins++; else losses++;
    }
    return { wins, losses };
};

/** One army row with its units, points and "needs review" flags, as the server's mapper builds it. */
const toEntity = (row: ArmyBuilderRow, snapshot: Snapshot) => {
    const units: ArmyBuilderUnit[] = snapshot.units
        .filter(u => u.ArmyBuilderId === row.id)
        .flatMap(u => {
            const unit = snapshot.catalog.get(u.ArmyCardId);
            if (!unit) return [];
            const owned = snapshot.owned.get(u.ArmyCardId) ?? 0;
            return [{ unit, quantity: u.Quantity, ownedQuantity: owned, overAllocated: u.Quantity > owned }];
        })
        .sort((a, b) => byName(a.unit, b.unit));

    const totalPoints = units.reduce((sum, u) => sum + pointsFor(u.unit, row.PointSystem) * u.quantity, 0);

    const reasons: string[] = [];
    const over = units.filter(u => u.overAllocated);
    if (over.length > 0) {
        reasons.push(`My Collection no longer has enough copies of: ${over.map(u => u.unit.name).join(', ')}.`);
    }
    if (totalPoints > row.PointLimit) {
        reasons.push(`Total ${row.PointSystem} points (${totalPoints}) exceed the limit (${row.PointLimit}).`);
    }

    return { units, totalPoints, reasons };
};

const compose = (row: ArmyBuilderRow, snapshot: Snapshot): ArmyBuilder => {
    const root = snapshot.armies.find(a => a.id === (row.ParentArmyBuilderId ?? row.id))!;
    const family = snapshot.armies.filter(a => a.id === root.id || a.ParentArmyBuilderId === root.id);
    const { units, totalPoints, reasons } = toEntity(row, snapshot);
    const tally = tallyOf(snapshot, row.id!);

    const variations: ArmyBuilderVariation[] = [...family]
        .sort((a, b) => a.PointLimit - b.PointLimit)
        .map(variation => {
            const summary = toEntity(variation, snapshot);
            const variationTally = tallyOf(snapshot, variation.id!);
            return {
                id: variation.id!,
                label: variation.VariationLabel,
                pointLimit: variation.PointLimit,
                pointSystem: variation.PointSystem as PointSystem,
                creator: variation.Creator,
                totalPoints: summary.totalPoints,
                unitCount: summary.units.reduce((sum, u) => sum + u.quantity, 0),
                wins: variationTally.wins,
                losses: variationTally.losses,
                needsReview: summary.reasons.length > 0,
            };
        });

    return {
        id: row.id!,
        armyId: root.id!,
        variations,
        name: row.Name,
        variationLabel: row.VariationLabel,
        pointLimit: row.PointLimit,
        pointSystem: row.PointSystem as PointSystem,
        creator: row.Creator,
        notes: row.Notes,
        isShared: false,
        shareId: root.ShareId,
        totalPoints,
        isOwner: true,
        isRetired: root.IsRetired,
        retiredAt: root.RetiredAt,
        needsReview: reasons.length > 0,
        reviewReasons: reasons,
        updatedAt: row.UpdatedAt,
        wins: tally.wins,
        losses: tally.losses,
        units,
    };
};

export const localGetMyArmyBuilders = async (): Promise<ArmyBuilder[]> => {
    const snapshot = await loadSnapshot();
    return snapshot.armies
        .filter(a => a.ParentArmyBuilderId === null)
        .map(root => compose(root, snapshot))
        .sort((a, b) => a.name.localeCompare(b.name));
};

export const localGetArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    const snapshot = await loadSnapshot();
    const row = snapshot.armies.find(a => a.id === id);
    if (!row) throw notFound();
    return compose(row, snapshot);
};

interface ValidatedArmy {
    name: string;
    label: string | null;
    pointLimit: number;
    pointSystem: PointSystem;
    creator: string | null;
    notes: string | null;
    units: Map<number, number>;
}

const validate = async (request: ArmyBuilderSaveRequest, armyId: number | null): Promise<ValidatedArmy> => {
    const errors: string[] = [];
    const snapshot = await loadSnapshot();

    const name = (request.name ?? '').trim();
    if (name.length === 0) {
        errors.push('An army name is required.');
    } else if (name.length > MAX_NAME_LENGTH) {
        errors.push(`Army names can be at most ${MAX_NAME_LENGTH} characters.`);
    } else if (snapshot.armies.some(a => a.ParentArmyBuilderId === null && a.id !== armyId && a.Name.toLowerCase() === name.toLowerCase())) {
        throw fail(409, `You already have an army named "${name}". Army names must be unique.`);
    }

    const label = request.variationLabel?.trim() ? request.variationLabel.trim() : null;
    if (label && label.length > MAX_NAME_LENGTH) {
        errors.push(`Variation names can be at most ${MAX_NAME_LENGTH} characters.`);
    }

    if (!(request.pointLimit > 0)) errors.push('The point limit must be greater than 0.');
    if (!isPointSystem(request.pointSystem)) errors.push(`"${request.pointSystem}" is not a known point system.`);

    const notes = request.notes?.trim() ? request.notes.trim() : null;
    if (notes && notes.length > MAX_NOTES_LENGTH) {
        errors.push(`Notes can be at most ${MAX_NOTES_LENGTH} characters (currently ${notes.length}).`);
    }

    const allowed: string[] = [];
    if (request.creator?.trim()) {
        const known = [...new Set([...snapshot.catalog.values()].map(u => u.creator))];
        for (const requested of request.creator.split(',').map(c => c.trim()).filter(Boolean)) {
            const match = known.find(c => c?.toLowerCase() === requested.toLowerCase());
            if (!match) errors.push(`"${requested}" is not a known creator.`);
            else if (!allowed.some(c => c.toLowerCase() === match.toLowerCase())) allowed.push(match);
        }
    }
    const creator = allowed.length > 0 ? allowed.join(',') : null;

    const requested = request.units ?? [];
    if (requested.some(u => u.quantity <= 0)) errors.push('Unit quantities must be at least 1.');
    const units = new Map<number, number>();
    for (const u of requested.filter(u => u.quantity > 0)) {
        units.set(u.unitId, (units.get(u.unitId) ?? 0) + u.quantity);
    }

    for (const [unitId, quantity] of units) {
        const card = snapshot.catalog.get(unitId);
        if (!card) {
            errors.push(`Unit ${unitId} does not exist.`);
            continue;
        }
        const owned = snapshot.owned.get(unitId) ?? 0;
        if (!request.allowUnowned) {
            if (owned === 0) errors.push(`${card.name} is not in My Collection.`);
            else if (quantity > owned) errors.push(`You only own ${owned} of ${card.name} but this army uses ${quantity}.`);
        }
        if (allowed.length > 0 && !allowed.some(c => c.toLowerCase() === card.creator?.toLowerCase())) {
            errors.push(`${card.name} is from ${card.creator}, but this army is restricted to ${creator}.`);
        }
    }

    // Unique units are limited by name so two cards of the same unique unit can't both be used.
    const uniqueTotals = new Map<string, { name: string; total: number }>();
    for (const [unitId, quantity] of units) {
        const card = snapshot.catalog.get(unitId);
        if (card?.rarity?.toLowerCase() !== 'unique') continue;
        const key = (card.name ?? '').trim().toLowerCase();
        const entry = uniqueTotals.get(key) ?? { name: card.name, total: 0 };
        entry.total += quantity;
        uniqueTotals.set(key, entry);
    }
    uniqueTotals.forEach(entry => {
        if (entry.total > 1) errors.push(`${entry.name} is a Unique unit and can only be in an army once.`);
    });

    const totalPoints = [...units].reduce((sum, [id, q]) => sum + pointsFor(snapshot.catalog.get(id), request.pointSystem) * q, 0);
    if (request.pointLimit > 0 && totalPoints > request.pointLimit) {
        errors.push(`Total ${request.pointSystem} points (${totalPoints}) exceed the army limit (${request.pointLimit}).`);
    }

    if (errors.length > 0) throw fail(400, ...errors);

    return { name, label, pointLimit: request.pointLimit, pointSystem: request.pointSystem, creator, notes, units };
};

const saveUnits = async (armyBuilderId: number, desired: Map<number, number>) => {
    const existing = await dbGetByIndex<ArmyBuilderUnitRow>('armybuilder_unit', 'ArmyBuilderId', armyBuilderId);
    const ops: Parameters<typeof dbBulk>[0] = [];
    const remaining = new Map(desired);
    for (const row of existing) {
        const quantity = remaining.get(row.ArmyCardId);
        if (quantity === undefined) {
            ops.push({ store: 'armybuilder_unit', delete: row.id! });
        } else {
            remaining.delete(row.ArmyCardId);
            ops.push({ store: 'armybuilder_unit', put: { ...row, Quantity: quantity } });
        }
    }
    remaining.forEach((quantity, cardId) => ops.push({
        store: 'armybuilder_unit',
        put: { ArmyBuilderId: armyBuilderId, ArmyCardId: cardId, Quantity: quantity },
    }));
    await dbBulk(ops);
};

export const localCreateArmyBuilder = async (request: ArmyBuilderSaveRequest): Promise<ArmyBuilder> => {
    await assertWritable();

    let root: ArmyBuilderRow | undefined;
    if (request.armyId !== undefined && request.armyId !== null) {
        root = await dbGet<ArmyBuilderRow>('armybuilder', request.armyId);
        if (!root || root.ParentArmyBuilderId !== null) throw notFound();
        request = { ...request, name: root.Name };
    }

    const validated = await validate(request, root?.id ?? null);
    const now = nowIso();
    const id = await dbPut('armybuilder', {
        UserId: LOCAL_USER_ID,
        Name: validated.name,
        PointLimit: validated.pointLimit,
        Creator: validated.creator,
        IsShared: false,
        ShareId: newGuid(),
        CreatedAt: now,
        UpdatedAt: now,
        Notes: validated.notes,
        PointSystem: validated.pointSystem,
        IsRetired: false,
        RetiredAt: null,
        ParentArmyBuilderId: root?.id ?? null,
        VariationLabel: validated.label,
    } satisfies ArmyBuilderRow);
    await saveUnits(id, validated.units);

    return localGetArmyBuilder(id);
};

export const localUpdateArmyBuilder = async (id: number, request: ArmyBuilderSaveRequest): Promise<ArmyBuilder> => {
    await assertWritable();
    const row = await dbGet<ArmyBuilderRow>('armybuilder', id);
    if (!row) throw notFound();
    const armyId = row.ParentArmyBuilderId ?? row.id!;

    const validated = await validate(request, armyId);
    const now = nowIso();

    // Only the army's name is shared; each variation keeps its own limit, point system, creator and notes.
    const siblings = (await dbGetAll<ArmyBuilderRow>('armybuilder'))
        .filter(a => (a.id === armyId || a.ParentArmyBuilderId === armyId) && a.id !== id && a.Name !== validated.name);
    await dbBulk([
        ...siblings.map(s => ({ store: 'armybuilder' as const, put: { ...s, Name: validated.name, UpdatedAt: now } })),
        {
            store: 'armybuilder' as const,
            put: {
                ...row,
                Name: validated.name,
                VariationLabel: validated.label,
                PointLimit: validated.pointLimit,
                PointSystem: validated.pointSystem,
                Creator: validated.creator,
                Notes: validated.notes,
                UpdatedAt: now,
            },
        },
    ]);
    await saveUnits(id, validated.units);

    return localGetArmyBuilder(id);
};

const familyOf = async (id: number): Promise<{ armyId: number; family: ArmyBuilderRow[] }> => {
    const all = await dbGetAll<ArmyBuilderRow>('armybuilder');
    const row = all.find(a => a.id === id);
    if (!row) throw notFound();
    const armyId = row.ParentArmyBuilderId ?? row.id!;
    return { armyId, family: all.filter(a => a.id === armyId || a.ParentArmyBuilderId === armyId) };
};

/** Logged results stay when an army goes away; they just stop pointing at it. */
const detachGames = async (armyBuilderIds: number[]): Promise<ArmyGameRow[]> => {
    const games = (await dbGetAll<ArmyGameRow>('army_game')).filter(g => g.ArmyBuilderId !== null && armyBuilderIds.includes(g.ArmyBuilderId));
    return games.map(g => ({ ...g, ArmyBuilderId: null }));
};

const removeRowsFor = async (armyBuilderId: number) => {
    const [units, journal] = await Promise.all([
        dbGetByIndex<ArmyBuilderUnitRow>('armybuilder_unit', 'ArmyBuilderId', armyBuilderId),
        dbGetByIndex<ArmyBuilderJournalRow>('armybuilder_journal', 'ArmyBuilderId', armyBuilderId),
    ]);
    return [
        ...units.map(u => ({ store: 'armybuilder_unit' as const, delete: u.id! })),
        ...journal.map(j => ({ store: 'armybuilder_journal' as const, delete: j.id! })),
    ];
};

export const localDeleteArmyBuilder = async (id: number): Promise<void> => {
    await assertWritable();
    const { family } = await familyOf(id);
    const ids = family.map(a => a.id!);
    const detached = await detachGames(ids);
    const removals = (await Promise.all(ids.map(removeRowsFor))).flat();

    await dbBulk([
        ...detached.map(g => ({ store: 'army_game' as const, put: g })),
        ...removals,
        ...family.map(a => ({ store: 'armybuilder' as const, delete: a.id! })),
    ]);
};

export const localDeleteVariation = async (id: number): Promise<ArmyBuilder> => {
    await assertWritable();
    const { family } = await familyOf(id);
    const row = family.find(a => a.id === id)!;
    if (family.length < 2) throw fail(400, "This is the army's only version. Delete the army instead.");

    const remaining = family.filter(a => a.id !== id).sort((a, b) => a.PointLimit - b.PointLimit);
    const survivor = remaining[0];
    const detached = await detachGames([id]);
    const ops: Parameters<typeof dbBulk>[0] = [
        ...detached.map(g => ({ store: 'army_game' as const, put: g })),
        ...(await removeRowsFor(id)),
    ];

    if (row.ParentArmyBuilderId === null) {
        // The lowest-point variation takes over as the army's primary version.
        ops.push({
            store: 'armybuilder',
            put: {
                ...survivor,
                ParentArmyBuilderId: null,
                IsShared: row.IsShared,
                ShareId: row.ShareId,
                IsRetired: row.IsRetired,
                RetiredAt: row.RetiredAt,
                CreatedAt: row.CreatedAt,
            },
        });
        remaining.slice(1).forEach(other => ops.push({ store: 'armybuilder', put: { ...other, ParentArmyBuilderId: survivor.id! } }));
    }
    ops.push({ store: 'armybuilder', delete: id });
    await dbBulk(ops);

    return localGetArmyBuilder(survivor.id!);
};

export const localShareArmyBuilder = async (): Promise<ArmyBuilder> => {
    throw signUpToShare();
};

const setRetired = async (id: number, retired: boolean): Promise<ArmyBuilder> => {
    await assertWritable();
    const { armyId } = await familyOf(id);
    const primary = (await dbGet<ArmyBuilderRow>('armybuilder', armyId))!;
    if (primary.IsRetired !== retired) {
        await dbPut('armybuilder', { ...primary, IsRetired: retired, RetiredAt: retired ? nowIso() : null });
    }
    return localGetArmyBuilder(id);
};

export const localRetireArmyBuilder = (id: number) => setRetired(id, true);
export const localRestoreArmyBuilder = (id: number) => setRetired(id, false);

// ---------- Journal ----------

const ensureArmy = async (id: number) => {
    if (!(await dbGet<ArmyBuilderRow>('armybuilder', id))) throw notFound();
};

const toJournalEntry = (row: ArmyBuilderJournalRow): JournalEntry => ({
    id: row.id!,
    entryDate: row.EntryDate,
    wentWell: row.WentWell,
    wentPoorly: row.WentPoorly,
    notes: row.Notes,
    updatedAt: row.UpdatedAt,
});

const cleanText = (value?: string | null) => (value?.trim() ? value.trim() : null);

const validateJournal = (request: JournalEntryRequest) => {
    const wentWell = cleanText(request.wentWell);
    const wentPoorly = cleanText(request.wentPoorly);
    const notes = cleanText(request.notes);
    const errors: string[] = [];

    if (!wentWell && !wentPoorly && !notes) errors.push('Write something in at least one of the journal fields.');
    for (const [label, value] of [['What went well', wentWell], ['What went poorly', wentPoorly], ['Notes', notes]] as const) {
        if (value && value.length > MAX_JOURNAL_FIELD) {
            errors.push(`${label} can be at most ${MAX_JOURNAL_FIELD} characters (currently ${value.length}).`);
        }
    }
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    if (request.entryDate && request.entryDate > tomorrow) errors.push('A journal entry cannot be dated in the future.');

    if (errors.length > 0) throw fail(400, ...errors);
    return { wentWell, wentPoorly, notes };
};

const sortJournal = (rows: ArmyBuilderJournalRow[]) =>
    [...rows].sort((a, b) => b.EntryDate.localeCompare(a.EntryDate) || b.id! - a.id!);

export const localGetJournal = async (id: number): Promise<JournalEntry[]> => {
    await ensureArmy(id);
    return sortJournal(await dbGetByIndex<ArmyBuilderJournalRow>('armybuilder_journal', 'ArmyBuilderId', id)).map(toJournalEntry);
};

export const localAddJournalEntry = async (id: number, request: JournalEntryRequest): Promise<JournalEntry> => {
    await assertWritable();
    await ensureArmy(id);
    const { wentWell, wentPoorly, notes } = validateJournal(request);
    const existing = await dbGetByIndex<ArmyBuilderJournalRow>('armybuilder_journal', 'ArmyBuilderId', id);
    if (existing.length >= MAX_JOURNAL_ENTRIES) throw fail(400, `An army can have at most ${MAX_JOURNAL_ENTRIES} journal entries.`);

    const now = nowIso();
    const row: ArmyBuilderJournalRow = {
        ArmyBuilderId: id,
        EntryDate: request.entryDate ?? now.slice(0, 10),
        WentWell: wentWell,
        WentPoorly: wentPoorly,
        Notes: notes,
        CreatedAt: now,
        UpdatedAt: now,
    };
    row.id = await dbPut('armybuilder_journal', row);
    return toJournalEntry(row);
};

export const localUpdateJournalEntry = async (entryId: number, request: JournalEntryRequest): Promise<JournalEntry> => {
    await assertWritable();
    const row = await dbGet<ArmyBuilderJournalRow>('armybuilder_journal', entryId);
    if (!row) throw fail(404, 'Journal entry not found.');
    const { wentWell, wentPoorly, notes } = validateJournal(request);

    const updated: ArmyBuilderJournalRow = {
        ...row,
        EntryDate: request.entryDate ?? row.EntryDate,
        WentWell: wentWell,
        WentPoorly: wentPoorly,
        Notes: notes,
        UpdatedAt: nowIso(),
    };
    await dbPut('armybuilder_journal', updated);
    return toJournalEntry(updated);
};

export const localDeleteJournalEntry = async (entryId: number): Promise<void> => {
    await assertWritable();
    if (!(await dbGet<ArmyBuilderJournalRow>('armybuilder_journal', entryId))) throw fail(404, 'Journal entry not found.');
    await dbDelete('armybuilder_journal', entryId);
};

// ---------- Results ----------

export const localGetArmyGames = async (id: number): Promise<ArmyGame[]> => {
    await ensureArmy(id);
    return (await dbGetByIndex<ArmyGameRow>('army_game', 'ArmyBuilderId', id))
        .sort((a, b) => b.PlayedAt.localeCompare(a.PlayedAt) || b.id! - a.id!)
        .slice(0, RECENT_GAMES)
        .map(g => ({ id: g.id!, won: g.Won, playedAt: g.PlayedAt, note: g.Note }));
};

const tallyFor = async (armyBuilderId: number): Promise<ArmyTally> => {
    const games = await dbGetByIndex<ArmyGameRow>('army_game', 'ArmyBuilderId', armyBuilderId);
    const wins = games.filter(g => g.Won).length;
    return { wins, losses: games.length - wins };
};

export const localLogArmyGames = async (id: number, request: ArmyGameRequest): Promise<ArmyTally> => {
    await assertWritable();
    const army = await dbGet<ArmyBuilderRow>('armybuilder', id);
    if (!army) throw notFound();

    const errors: string[] = [];
    const count = request.count ?? 1;
    if (count < 1 || count > MAX_GAME_BATCH) errors.push(`You can record between 1 and ${MAX_GAME_BATCH} results at a time.`);

    const note = cleanText(request.note);
    if (note && note.length > MAX_GAME_NOTE) errors.push(`Notes can be at most ${MAX_GAME_NOTE} characters.`);

    const now = new Date();
    const playedAtRaw = (request as { playedAt?: string | null }).playedAt;
    const playedAt = playedAtRaw ? new Date(playedAtRaw) : now;
    if (playedAt.getTime() > now.getTime() + 24 * 60 * 60 * 1000) errors.push('A game cannot be dated in the future.');

    const catalog = await getCatalog();
    const units = (await dbGetByIndex<ArmyBuilderUnitRow>('armybuilder_unit', 'ArmyBuilderId', id))
        .map(u => ({ ArmyCardId: u.ArmyCardId, Quantity: u.Quantity, Points: pointsFor(catalog.get(u.ArmyCardId), army.PointSystem) }));
    if (units.length === 0) errors.push('Add some units to this army before recording a result.');

    if (errors.length === 0 && (await dbGetAll<ArmyGameRow>('army_game')).length + count > MAX_GAMES) {
        errors.push(`That would go over the limit of ${MAX_GAMES} recorded games.`);
    }
    if (errors.length > 0) throw fail(400, ...errors);

    for (let i = 0; i < count; i++) {
        const game: ArmyGameRow = {
            UserId: LOCAL_USER_ID,
            ArmyBuilderId: id,
            Won: request.won,
            PlayedAt: playedAt.toISOString(),
            Note: note,
            CreatedAt: now.toISOString(),
        };
        const gameId = await dbPut('army_game', game);
        await dbBulk(units.map(u => ({ store: 'army_game_unit' as const, put: { ArmyGameId: gameId, ...u } satisfies ArmyGameUnitRow })));
    }

    return tallyFor(id);
};

export const localDeleteArmyGame = async (gameId: number): Promise<ArmyTally> => {
    await assertWritable();
    const game = await dbGet<ArmyGameRow>('army_game', gameId);
    if (!game) throw fail(404, 'Game not found.');

    const units = await dbGetByIndex<ArmyGameUnitRow>('army_game_unit', 'ArmyGameId', gameId);
    await dbBulk([
        ...units.map(u => ({ store: 'army_game_unit' as const, delete: u.id! })),
        { store: 'army_game', delete: gameId },
    ]);
    return game.ArmyBuilderId === null ? { wins: 0, losses: 0 } : tallyFor(game.ArmyBuilderId);
};
