import { useEffect, useState } from 'react';
import { Unit } from '../models/unit';
import { UnitFile } from '../models/unit-file';
import { getUnits } from './unit-service';

/** Matches SlugHelper.Slugify on the server (used for the sitemap and server-rendered pages). */
export const slugify = (value?: string | null): string =>
    (value ?? '')
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

export type GroupKind = 'species' | 'generals' | 'sets';

export interface UnitGroup {
    slug: string;
    name: string;
    units: Unit[];
}

export interface Catalog {
    units: Unit[];
    bySlug: Map<string, Unit>;
    species: Map<string, UnitGroup>;
    generals: Map<string, UnitGroup>;
    sets: Map<string, UnitGroup>;
}

const byName = (a: Unit, b: Unit) => (a.name ?? '').localeCompare(b.name ?? '', undefined, { sensitivity: 'base' });

const groupUnits = (units: Unit[], key: (unit: Unit) => string | undefined): Map<string, UnitGroup> => {
    const groups = new Map<string, UnitGroup & { spellings: Map<string, number> }>();

    for (const unit of units) {
        const label = key(unit)?.trim();
        const slug = slugify(label);
        if (!label || !slug) continue;

        let group = groups.get(slug);
        if (!group) {
            group = { slug, name: label, units: [], spellings: new Map() };
            groups.set(slug, group);
        }
        group.units.push(unit);
        group.spellings.set(label, (group.spellings.get(label) ?? 0) + 1);
    }

    // Spellings are printed as-is on the cards; show the most common one for each group.
    for (const group of groups.values()) {
        group.name = [...group.spellings.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }

    return groups;
};

export const buildCatalog = (allUnits: Unit[]): Catalog => {
    const units = [...allUnits].sort(byName);
    return {
        units,
        bySlug: new Map(units.map(unit => [unit.slug, unit])),
        species: groupUnits(units, unit => unit.race),
        generals: groupUnits(units, unit => unit.general),
        sets: groupUnits(units, unit => unit.set?.name),
    };
};

// One shared request: every unit/species/general/set page reads from the same catalog.
let catalogPromise: Promise<Catalog> | null = null;

export const loadCatalog = (): Promise<Catalog> => {
    if (!catalogPromise) {
        catalogPromise = (async () => buildCatalog(await getUnits()))()
            .catch(error => {
                catalogPromise = null;
                throw error;
            });
    }
    return catalogPromise;
};

export const useCatalog = (): { catalog: Catalog | null; error: boolean } => {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        loadCatalog()
            .then(result => { if (!cancelled) setCatalog(result); })
            .catch(() => { if (!cancelled) setError(true); });
        return () => { cancelled = true; };
    }, []);

    return { catalog, error };
};

export const unitPath = (unit: Pick<Unit, 'slug'>) => `/units/${unit.slug}`;
export const groupPath = (kind: GroupKind, name?: string | null) => `/${kind}/${slugify(name)}`;

// ---------- Card files ----------

export interface CardKind {
    purpose: string;
    label: string;
    description: string;
    /** Where visitors can make their own card of this format. */
    createPath?: string;
    downloadPath?: string;
}

export const CARD_KINDS: CardKind[] = [
    {
        purpose: 'Standard_Army_Card',
        label: 'Standard card',
        description: 'Full-size army card, the same format as the original Hasbro cards.',
        createPath: '/army-cards/standard/create',
        downloadPath: '/army-cards/standard/download',
    },
    {
        purpose: '3x5_Army_Card',
        label: '3x5 index card',
        description: 'Fits a 3x5 index card for a compact, sleeve-friendly army.',
        createPath: '/army-cards/threebyfive/create',
        downloadPath: '/army-cards/threebyfive/download',
    },
    {
        purpose: 'PC_Army_Card',
        label: 'Playing card',
        description: 'Poker-size card that fits standard card sleeves.',
        createPath: '/army-cards/playingcard/create',
        downloadPath: '/army-cards/playingcard/download',
    },
];

/** A unit's card file for a format, preferring one that has a thumbnail. */
export const getCardFile = (unit: Unit, purpose: string): UnitFile | undefined => {
    const files = unit.files.filter(file => file.filePurpose === purpose);
    return files.find(file => file.thumb) ?? files[0];
};

/** The best card thumbnail for sharing / the page header. */
export const getPrimaryImage = (unit: Unit): string | undefined => {
    for (const kind of CARD_KINDS) {
        const thumb = getCardFile(unit, kind.purpose)?.thumb;
        if (thumb) return thumb;
    }
    return unit.files.find(file => file.filePurpose === 'Card_Hitbox_Image')?.filePath;
};

export const getHitboxImage = (unit: Unit): string | undefined =>
    unit.files.find(file => file.filePurpose === 'Card_Hitbox_Image')?.filePath;

// ---------- Auto-generated text ----------

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

/** A readable intro paragraph for a unit, generated from its data. */
export const describeUnit = (unit: Unit, points?: number): string => {
    const identity = [unit.race, unit.role].filter(Boolean).join(' ');
    const sentence = [`${unit.name} is a`, identity || null, `${(unit.type ?? 'unit').toLowerCase()}`].filter(Boolean).join(' ');
    const parts = [`${sentence}${unit.rarity ? ` (${unit.rarity.toLowerCase()})` : ''}${unit.general ? ` that fights for ${unit.general}` : ''}.`];

    const stats = [
        unit.life != null && `Life ${unit.life}`,
        unit.advMove != null && `Move ${unit.advMove}`,
        unit.advRange != null && `Range ${unit.advRange}`,
        unit.advAttack != null && `Attack ${unit.advAttack}`,
        unit.advDefense != null && `Defense ${unit.advDefense}`,
        points != null && `${points} points`,
    ].filter(Boolean);
    if (stats.length) parts.push(`Its stats are ${stats.join(', ')}.`);

    if (unit.set) parts.push(`It comes in ${unit.set.name}${unit.set.releaseDate ? `, released ${unit.set.releaseDate.slice(0, 4)}` : ''}.`);
    if (unit.abilities.length) parts.push(`Special abilities: ${unit.abilities.map(a => a.abilityName).filter(Boolean).join(', ')}.`);

    return parts.join(' ');
};

export const describeGroup = (kind: GroupKind, group: UnitGroup): string => {
    const noun = kind === 'species' ? 'species' : kind === 'generals' ? 'general' : 'set';
    const names = group.units.slice(0, 8).map(unit => unit.name).join(', ');
    return `All ${plural(group.units.length, 'Heroscape unit')} for the ${group.name} ${noun}, including ${names}. Stats, abilities and free printable army cards.`;
};

export const average = (values: Array<number | null | undefined>): number | undefined => {
    const numbers = values.filter((v): v is number => typeof v === 'number');
    return numbers.length ? numbers.reduce((sum, v) => sum + v, 0) / numbers.length : undefined;
};
