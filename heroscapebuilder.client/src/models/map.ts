import { slugify } from '../services/catalog';

export interface MapCreatorOption {
    id: number;
    name: string;
}

export interface TerrainTypeOption {
    id: number;
    name: string;
    /** Sizes this type comes in. Empty means it is available in every size. */
    allowedSizeIds: number[];
    /** Same-size tiles of types sharing this group can stand in for each other. Null = special rules, never swapped. */
    swapGroup: string | null;
    /** Replaces swapGroup for single space tiles only (water, trees, columns). */
    singleSwapGroup: string | null;
    /** Gameplay effect summary shown on hover. Null = no special rules. */
    specialRules: string | null;
}

export interface TerrainSizeOption {
    id: number;
    name: string;
    spaces: number;
}

export interface MapOptions {
    creators: MapCreatorOption[];
    terrainTypes: TerrainTypeOption[];
    terrainSizes: TerrainSizeOption[];
}

export interface MapTileInput {
    terrainTypeId: number;
    terrainSizeId: number;
    quantity: number;
}

/** An edit leaves the stored PDF / thumbnail alone when the matching file is not supplied. */
export type MapUpdateInput = Omit<MapUploadInput, 'file' | 'thumbnail'> & {
    file?: File | null;
    thumbnail?: File | null;
};

export interface MapUploadInput {
    name: string;
    /** Null when the map is for a customer. */
    creatorId: number | null;
    /** Only used when creatorId is null. */
    customerName: string;
    playerCount: number;
    /** Free text; empty when the map isn't made for a scenario. */
    scenario: string;
    tiles: MapTileInput[];
    file: File;
    thumbnail: File;
}

export interface MapTile {
    terrainTypeId: number;
    terrainSizeId: number;
    /** Spaces (hexes) one tile of this size covers. */
    spaces: number;
    quantity: number;
}

export interface MapSummary {
    id: number;
    name: string;
    /** Set for maps by a known creator; otherwise customerName is set. */
    creatorId: number | null;
    creatorName: string | null;
    /** Short creator code (C3V, ...), used to pick the creator's logo. */
    creatorAbbreviation: string | null;
    customerName: string | null;
    playerCount: number;
    /** Free-text scenario the map was made for, if any. */
    scenario: string | null;
    filePath: string;
    thumbnailPath: string;
    createdAt: string;
    tiles: MapTile[];
    /** Sum of all tile quantities. */
    tileCount: number;
    /** Sum of quantity x spaces over all tiles. */
    spaceCount: number;
}

/** The swap group a tile of this type and size belongs to, or null when it can only be used as itself. */
const swapGroupOf = (type: TerrainTypeOption | undefined, size: TerrainSizeOption | undefined): string | null => {
    if (!type || !size) return null;
    return size.spaces === 1 ? type.singleSwapGroup ?? type.swapGroup : type.swapGroup;
};

export interface MissingTile {
    terrainTypeId: number;
    terrainSizeId: number;
    /** How many more of this tile the user needs. */
    missing: number;
    /**
     * Set when any tile of this swap group and size would do (tile swap is on), so the shortfall is not tied to
     * one type. terrainTypeId is then just one member of the group.
     */
    swapGroup: string | null;
}

/** How a swap group reads in the missing list; groups not listed fall back to the member names. */
const SWAP_GROUP_LABELS: Record<string, string> = {
    land: "plain terrain tile",
    outcrop: "outcrop",
    water: "Water or Swamp Water",
    scenery: "tree, pillar or fortress column",
};

/**
 * A Fortress Column set on a Fortress Base looks and plays as one Pillar, so a Pillar stands in for a base + column
 * pair and a pair stands in for a Pillar. Maps list the base and column separately, which a 1:1 swap cannot cover.
 * Returns owned with spare pieces converted to the other form where that closes a shortfall.
 */
const applyPillarPairs = (map: MapSummary, owned: Map<string, number>, options: MapOptions): Map<string, number> => {
    const single = options.terrainSizes.find(s => s.spaces === 1);
    const idOf = (name: string) => options.terrainTypes.find(t => t.name === name)?.id;
    const baseId = idOf("Fortress Base"), columnId = idOf("Fortress Column"), pillarId = idOf("Pillar");
    if (!single || baseId === undefined || columnId === undefined || pillarId === undefined) return owned;

    const key = (typeId: number) => `${typeId}:${single.id}`;
    const needOf = (typeId: number) => map.tiles.find(t => t.terrainTypeId === typeId && t.terrainSizeId === single.id)?.quantity ?? 0;
    const result = new Map(owned);
    const get = (typeId: number) => result.get(key(typeId)) ?? 0;
    const add = (typeId: number, delta: number) => result.set(key(typeId), get(typeId) + delta);

    // Spare Pillars cover base + column shortfalls.
    const pillarsForPairs = Math.min(
        Math.max(0, needOf(baseId) - get(baseId)),
        Math.max(0, needOf(columnId) - get(columnId)),
        Math.max(0, get(pillarId) - needOf(pillarId)));
    if (pillarsForPairs > 0) {
        add(pillarId, -pillarsForPairs);
        add(baseId, pillarsForPairs);
        add(columnId, pillarsForPairs);
    }

    // Spare base + column pairs cover Pillar shortfalls.
    const pairsForPillars = Math.min(
        Math.max(0, needOf(pillarId) - get(pillarId)),
        Math.max(0, get(baseId) - needOf(baseId)),
        Math.max(0, get(columnId) - needOf(columnId)));
    if (pairsForPillars > 0) {
        add(baseId, -pairsForPillars);
        add(columnId, -pairsForPillars);
        add(pillarId, pairsForPillars);
    }
    return result;
};

/**
 * The tiles the map needs beyond what the user owns (owned is keyed "typeId:sizeId"). Empty means the map can be built.
 * With allowSwap, a shortfall is first filled by spare tiles of the same size from another type in the same swap group.
 */
export const getMissingTiles = (map: MapSummary, ownedTiles: Map<string, number>, options: MapOptions, allowSwap: boolean): MissingTile[] => {
    const owned = allowSwap ? applyPillarPairs(map, ownedTiles, options) : ownedTiles;
    const types = new Map(options.terrainTypes.map(t => [t.id, t]));
    const sizes = new Map(options.terrainSizes.map(s => [s.id, s]));
    const tileKey = (typeId: number, sizeId: number) => `${typeId}:${sizeId}`;
    const bucketOf = (typeId: number, sizeId: number) => {
        const group = allowSwap ? swapGroupOf(types.get(typeId), sizes.get(sizeId)) : null;
        return group ? `${group}|${sizeId}` : null;
    };
    const needed = new Map(map.tiles.map(t => [tileKey(t.terrainTypeId, t.terrainSizeId), t.quantity]));

    // Spare tiles per swap bucket: what is owned beyond what the map needs of that exact type and size.
    const spare = new Map<string, number>();
    owned.forEach((quantity, key) => {
        const [typeId, sizeId] = key.split(":").map(Number);
        const bucket = bucketOf(typeId, sizeId);
        if (!bucket) return;
        spare.set(bucket, (spare.get(bucket) ?? 0) + Math.max(0, quantity - (needed.get(key) ?? 0)));
    });

    const result: MissingTile[] = [];
    // Shortfalls in a swap bucket are one pooled count: any tile of that group and size fills them.
    const pooled = new Map<string, MissingTile>();
    for (const tile of map.tiles) {
        let missing = tile.quantity - (owned.get(tileKey(tile.terrainTypeId, tile.terrainSizeId)) ?? 0);
        if (missing <= 0) continue;
        const bucket = bucketOf(tile.terrainTypeId, tile.terrainSizeId);
        if (bucket) {
            const used = Math.min(missing, spare.get(bucket) ?? 0);
            spare.set(bucket, (spare.get(bucket) ?? 0) - used);
            missing -= used;
        }
        if (missing <= 0) continue;
        if (bucket) {
            const existing = pooled.get(bucket);
            if (existing) existing.missing += missing;
            else pooled.set(bucket, { terrainTypeId: tile.terrainTypeId, terrainSizeId: tile.terrainSizeId, missing, swapGroup: bucket.split("|")[0] });
        } else {
            result.push({ terrainTypeId: tile.terrainTypeId, terrainSizeId: tile.terrainSizeId, missing, swapGroup: null });
        }
    }
    return [...result, ...pooled.values()];
};

export const canBuildMap = (map: MapSummary, owned: Map<string, number>, options: MapOptions, allowSwap: boolean): boolean =>
    getMissingTiles(map, owned, options, allowSwap).length === 0;

/** "2 \u00d7 Grass (24 space)", or "2 \u00d7 any plain terrain tile (24 space)" when a swap would do. */
export const describeMissingTile = (tile: MissingTile, options: MapOptions): string => {
    const type = tile.swapGroup
        ? `any ${SWAP_GROUP_LABELS[tile.swapGroup] ?? "tile of the same kind"}`
        : options.terrainTypes.find(t => t.id === tile.terrainTypeId)?.name ?? "Unknown terrain";
    const size = options.terrainSizes.find(s => s.id === tile.terrainSizeId)?.name ?? "";
    return `${tile.missing} \u00d7 ${type}${size ? ` (${size})` : ""}`;
};

/** The author shown for a map: the creator's name, or the free-text customer name. */
export const getMapAuthor = (map: MapSummary): string => map.creatorName ?? map.customerName ?? '';

/** Page for one map. The id leads so the link survives a rename; the slug is only there for readable URLs. */
export const mapPath = (map: Pick<MapSummary, 'id' | 'name'>): string => {
    const slug = slugify(map.name);
    return `/maps/${map.id}${slug ? `-${slug}` : ''}`;
};
