import { dbGet, dbPut } from './idb';

/**
 * Remembers, in this browser, that its owner has an account. Without it a visitor who already registered could
 * keep saving to the browser and drift out of sync with their account, so saving is refused until they log in.
 */
const META_KEY = 'hasAccount';
const MIRROR_KEY = 'hsb.hasAccount';

export const LOGIN_REQUIRED_EVENT = 'my-heroscape-login-required';

export const hasAccountFlag = async (): Promise<boolean> => {
    try {
        if ((await dbGet<{ key: string; value: boolean }>('local_meta', META_KEY))?.value) return true;
    } catch {
        // Fall through to the mirror below.
    }
    try {
        return localStorage.getItem(MIRROR_KEY) === '1';
    } catch {
        return false;
    }
};

export const markHasAccount = async (): Promise<void> => {
    try {
        localStorage.setItem(MIRROR_KEY, '1');
    } catch {
        // Private mode; the IndexedDB record below is the main one.
    }
    try {
        await dbPut('local_meta', { key: META_KEY, value: true, markedAt: new Date().toISOString() });
    } catch {
        // IndexedDB unavailable; the mirror (if it could be written) still carries the flag.
    }
};
