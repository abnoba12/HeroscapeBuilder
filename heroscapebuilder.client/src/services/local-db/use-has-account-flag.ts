import { useEffect, useState } from 'react';
import { hasAccountFlag } from './local-account';

/**
 * Whether this browser is known to belong to someone with an account.
 * Null until the check finishes, so callers can avoid flashing the wrong state.
 */
export const useHasAccountFlag = (recheckKey?: string): boolean | null => {
    const [flag, setFlag] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;
        hasAccountFlag().then(value => { if (!cancelled) setFlag(value); });
        return () => { cancelled = true; };
    }, [recheckKey]);

    return flag;
};
