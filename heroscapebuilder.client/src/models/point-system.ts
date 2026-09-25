import { Unit } from './unit';

/**
 * The competing sets of unit point values. Every unit has Standard points; Renegade and Delta
 * override them for some units and fall back to Standard otherwise.
 */
export type PointSystem = 'Standard' | 'Renegade' | 'Delta';

export const DEFAULT_POINT_SYSTEM: PointSystem = 'Renegade';

export interface PointSystemInfo {
    value: PointSystem;
    label: string;
    description: string;
}

export const POINT_SYSTEMS: PointSystemInfo[] = [
    {
        value: 'Renegade',
        label: 'Renegade',
        description: "Renegade's official points, including its adjustments to original Hasbro units.",
    },
    {
        value: 'Standard',
        label: 'Standard',
        description: 'The original points printed by Hasbro (and by Renegade for its own units), with no later adjustments.',
    },
    {
        value: 'Delta',
        label: 'Delta',
        description: 'Community-maintained Delta points from heroscape.org. Units without a Delta value use Standard.',
    },
];

export const isPointSystem = (value: unknown): value is PointSystem =>
    POINT_SYSTEMS.some(system => system.value === value);

type PointValues = Pick<Unit, 'standardPoints' | 'renegadePoints' | 'deltaPoints'>;

/** The unit's points under the given system, falling back to Standard when it has no override. */
export const getUnitPoints = (unit: PointValues | undefined | null, system: PointSystem): number | undefined => {
    if (!unit) return undefined;
    const override = system === 'Renegade' ? unit.renegadePoints
        : system === 'Delta' ? unit.deltaPoints
        : undefined;
    return override ?? unit.standardPoints ?? undefined;
};
