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

export interface MapSummary {
    id: number;
    name: string;
    playerCount: number;
    filePath: string;
    thumbnailPath: string;
}
