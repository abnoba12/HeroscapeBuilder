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
    filePath: string;
    thumbnailPath: string;
    createdAt: string;
    tiles: MapTile[];
    /** Sum of all tile quantities. */
    tileCount: number;
    /** Sum of quantity x spaces over all tiles. */
    spaceCount: number;
}

/** The author shown for a map: the creator's name, or the free-text customer name. */
export const getMapAuthor = (map: MapSummary): string => map.creatorName ?? map.customerName ?? '';

/** Page for one map. The id leads so the link survives a rename; the slug is only there for readable URLs. */
export const mapPath = (map: Pick<MapSummary, 'id' | 'name'>): string => {
    const slug = slugify(map.name);
    return `/maps/${map.id}${slug ? `-${slug}` : ''}`;
};
