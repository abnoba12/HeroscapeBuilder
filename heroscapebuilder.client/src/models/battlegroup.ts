import { PointSystem } from './point-system';
import { Unit } from './unit';

export interface BattlegroupUnit {
    unit: Unit;
    quantity: number;
    /** Copies the owner has in My Army. Only meaningful for the owner. */
    ownedQuantity: number;
    /** The battlegroup uses more copies than My Army currently holds. Only set for the owner. */
    overAllocated: boolean;
}

export interface Battlegroup {
    id: number;
    name: string;
    pointLimit: number;
    /** The point values this Battlegroup is built with; totalPoints is measured in it. */
    pointSystem: PointSystem;
    /** Null/undefined when units from any creator are allowed. */
    creator?: string | null;
    /** The owner's plain-text notes on how to play this Battlegroup. */
    notes?: string | null;
    isShared: boolean;
    /** Only present for the owner. */
    shareId?: string | null;
    totalPoints: number;
    isOwner: boolean;
    needsReview: boolean;
    reviewReasons: string[];
    updatedAt: string;
    /** The owner's logged results with this army. Zero for anyone else. */
    wins: number;
    losses: number;
    units: BattlegroupUnit[];
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

export interface BattlegroupSaveRequest {
    name: string;
    pointLimit: number;
    pointSystem: PointSystem;
    creator?: string | null;
    notes?: string | null;
    units: Array<{ unitId: number; quantity: number }>;
}
