/** Row shapes of the browser copy of the user tables. Column names match the SQL tables exactly. */

export interface UserCardRow {
    id?: number;
    UserId: string;
    OwnedArmyCard: number;
    Quantity: number;
}

export interface UserTerrainRow {
    id?: number;
    user_id: string;
    terrain_type_id: number;
    terrain_size_id: number;
    quantity: number;
}

export interface ArmyBuilderRow {
    id?: number;
    UserId: string;
    Name: string;
    PointLimit: number;
    Creator: string | null;
    IsShared: boolean;
    ShareId: string;
    CreatedAt: string;
    UpdatedAt: string;
    Notes: string | null;
    PointSystem: string;
    IsRetired: boolean;
    RetiredAt: string | null;
    ParentArmyBuilderId: number | null;
    VariationLabel: string | null;
}

export interface ArmyBuilderUnitRow {
    id?: number;
    ArmyBuilderId: number;
    ArmyCardId: number;
    Quantity: number;
}

export interface ArmyBuilderJournalRow {
    id?: number;
    ArmyBuilderId: number;
    /** yyyy-MM-dd */
    EntryDate: string;
    WentWell: string | null;
    WentPoorly: string | null;
    Notes: string | null;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface ArmyGameRow {
    id?: number;
    UserId: string;
    ArmyBuilderId: number | null;
    Won: boolean;
    PlayedAt: string;
    Note: string | null;
    CreatedAt: string;
}

export interface ArmyGameUnitRow {
    id?: number;
    ArmyGameId: number;
    ArmyCardId: number;
    Quantity: number;
    Points: number;
}
