import { PointSystem } from './point-system';
import { Unit } from './unit';

export interface ArmyBuilderUnit {
    unit: Unit;
    quantity: number;
    /** Copies the owner has in My Army. Only meaningful for the owner. */
    ownedQuantity: number;
    /** The army builder uses more copies than My Army currently holds. Only set for the owner. */
    overAllocated: boolean;
}

/** A short summary of one variation of an army (another version of it that can differ in any way). */
export interface ArmyBuilderVariation {
    id: number;
    label?: string | null;
    pointLimit: number;
    pointSystem: PointSystem;
    creator?: string | null;
    totalPoints: number;
    unitCount: number;
    wins: number;
    losses: number;
    needsReview: boolean;
}

export interface ArmyBuilder {
    /** The id of this variation. Results and the journal belong to it. */
    id: number;
    /** The id of the army's primary variation. Sharing, retiring and deleting the army act on it. */
    armyId: number;
    /** Every variation of this army (this one included), lowest point limit first. */
    variations: ArmyBuilderVariation[];
    name: string;
    /** This variation's own name, if the owner gave it one. */
    variationLabel?: string | null;
    pointLimit: number;
    /** The point values this Army builder is built with; totalPoints is measured in it. */
    pointSystem: PointSystem;
    /** Null/undefined when units from any creator are allowed. */
    creator?: string | null;
    /** The owner's plain-text notes on how to play this Army builder. */
    notes?: string | null;
    isShared: boolean;
    /** Only present for the owner. */
    shareId?: string | null;
    totalPoints: number;
    isOwner: boolean;
    /** Hidden from the active list on My Armies and shown under "Retired" instead. Owner only. */
    isRetired: boolean;
    retiredAt?: string | null;
    needsReview: boolean;
    reviewReasons: string[];
    updatedAt: string;
    /** The owner's logged results with this army. Zero for anyone else. */
    wins: number;
    losses: number;
    units: ArmyBuilderUnit[];
}

export interface ArmyTally {
    wins: number;
    losses: number;
}

export interface ArmyGame {
    id: number;
    won: boolean;
    playedAt: string;
    note?: string | null;
}

export interface ArmyGameRequest {
    won: boolean;
    /** How many identical results to record at once (for entering past results). */
    count?: number;
    note?: string | null;
}

/** One entry in the owner's private play journal for an army. */
export interface JournalEntry {
    id: number;
    /** yyyy-MM-dd */
    entryDate: string;
    wentWell?: string | null;
    wentPoorly?: string | null;
    notes?: string | null;
    updatedAt: string;
}

export interface JournalEntryRequest {
    entryDate?: string | null;
    wentWell?: string | null;
    wentPoorly?: string | null;
    notes?: string | null;
}

export interface ArmyBuilderSaveRequest {
    /** When creating: the army to add this variation to (its name is used). */
    armyId?: number;
    name: string;
    variationLabel?: string | null;
    pointLimit: number;
    pointSystem: PointSystem;
    /** One creator, or several joined by commas. */
    creator?: string | null;
    /** Lets the army include units/quantities not in My Collection (planning future purchases). */
    allowUnowned?: boolean;
    notes?: string | null;
    units: Array<{ unitId: number; quantity: number }>;
}
