import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Page state kept in the URL query string so a link reproduces the same view.
 * Updates replace the history entry (typing a search shouldn't fill the back button) and a value
 * equal to its default is dropped from the URL to keep shared links short.
 */
export const useUrlParam = (key: string, defaultValue = ''): [string, (value: string) => void] => {
    const [searchParams, setSearchParams] = useSearchParams();
    const value = searchParams.get(key) ?? defaultValue;

    const setValue = useCallback((next: string) => {
        // The functional form keeps several params changed in the same tick from overwriting each other.
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if (next === defaultValue || next === '') params.delete(key);
            else params.set(key, next);
            return params;
        }, { replace: true });
    }, [key, defaultValue, setSearchParams]);

    return [value, setValue];
};

/** A URL param limited to a known set of values; anything else in the URL falls back to the default. */
export const useUrlEnum = <T extends string>(key: string, allowed: readonly T[], defaultValue: T): [T, (value: T) => void] => {
    const [raw, setRaw] = useUrlParam(key, defaultValue);
    const value = (allowed as readonly string[]).includes(raw) ? (raw as T) : defaultValue;
    return [value, setRaw as (value: T) => void];
};

/** A true/false URL param (`1` / `0`); only a value that differs from the default appears in the URL. */
export const useUrlFlag = (key: string, defaultValue: boolean): [boolean, (value: boolean) => void] => {
    const [raw, setRaw] = useUrlParam(key, defaultValue ? '1' : '0');
    return [raw === '1', useCallback((value: boolean) => setRaw(value ? '1' : '0'), [setRaw])];
};

/** A numeric URL param; empty when absent or not a number. */
export const useUrlNumber = (key: string): [number | '', (value: number | '') => void] => {
    const [raw, setRaw] = useUrlParam(key);
    const parsed = raw === '' ? NaN : Number(raw);
    return [Number.isFinite(parsed) ? parsed : '', useCallback((value: number | '') => setRaw(value === '' ? '' : String(value)), [setRaw])];
};

/** Reads a JSON value out of a URL param, or undefined if it is missing or malformed. */
export const parseUrlJson = <T,>(raw: string): T | undefined => {
    if (!raw) return undefined;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return undefined;
    }
};
