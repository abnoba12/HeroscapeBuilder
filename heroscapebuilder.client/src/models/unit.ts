import { Set } from './set';
import { Ability } from './ability';
import { UnitFile } from './unit-file';

export interface Unit {
    creator: string;
    general?: string;
    name: string;
    race?: string;
    role?: string;
    personality?: string;
    rarity?: string;
    type?: string;
    sizeCategory?: string;
    size?: number;
    life?: number;
    advMove?: number;
    advRange?: number;
    advAttack?: number;
    advDefense?: number;
    standardPoints?: number | null;
    /** Renegade override; null means Standard applies. Use getUnitPoints() rather than reading these directly. */
    renegadePoints?: number | null;
    /** Delta override; null means Standard applies. */
    deltaPoints?: number | null;
    basicMove?: number;
    basicRange?: number;
    basicAttack?: number;
    basicDefense?: number;
    planet?: string;
    unitNumbers?: string;
    quantity?: number;
    id: number;
    set?: Set; // Assuming Set is another model you'll define
    note?: string;
    abilities: Ability[]; // Assuming Ability is another model you'll define
    files: UnitFile[]; // Assuming UnitFile is another model you'll define
    stlUrls?: string[];
}
