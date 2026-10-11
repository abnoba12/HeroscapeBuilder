import { useCallback, useMemo } from 'react';
import { Unit } from '../models/unit';
import { useUrlParam } from './url-state';

export interface CreatorFilter {
    /** Every creator present in the units, alphabetical. */
    creators: string[];
    hidden: ReadonlySet<string>;
    toggle: (creator: string) => void;
    clear: () => void;
    /** The units whose creator isn't hidden. */
    apply: (units: Unit[]) => Unit[];
}

/**
 * Lets a page hide units by creator (e.g. the C3V and SoV customs that most events don't allow).
 * Hidden creators live in the `hide` URL param as a comma list so a link reproduces the view.
 */
export const useCreatorFilter = (units: Unit[] | undefined): CreatorFilter => {
    const [raw, setRaw] = useUrlParam('hide');
    const hidden = useMemo(() => new Set(raw.split(',').filter(Boolean)), [raw]);

    const creators = useMemo(
        () => [...new Set((units ?? []).map(unit => unit.creator).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
        [units],
    );

    const toggle = useCallback((creator: string) => {
        const next = new Set(hidden);
        if (!next.delete(creator)) next.add(creator);
        setRaw([...next].join(','));
    }, [hidden, setRaw]);

    const clear = useCallback(() => setRaw(''), [setRaw]);

    const apply = useCallback(
        (list: Unit[]) => (hidden.size ? list.filter(unit => !hidden.has(unit.creator)) : list),
        [hidden],
    );

    return { creators, hidden, toggle, clear, apply };
};
