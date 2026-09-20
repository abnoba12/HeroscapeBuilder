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
    units: BattlegroupUnit[];
}

export interface BattlegroupSaveRequest {
    name: string;
    pointLimit: number;
    creator?: string | null;
    notes?: string | null;
    units: Array<{ unitId: number; quantity: number }>;
}
