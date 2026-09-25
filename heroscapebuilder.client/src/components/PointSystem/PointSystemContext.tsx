import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_POINT_SYSTEM, PointSystem, getUnitPoints, isPointSystem } from '../../models/point-system';
import { Unit } from '../../models/unit';
import { getUser, isAuthenticated } from '../../services/authService';
import { getProfile, setProfilePointSystem } from '../../services/profile-service';

interface PointSystemContextValue {
    /** The signed-in account's default point system, or Renegade for visitors and accounts that never chose one. */
    defaultPointSystem: PointSystem;
    /** Saves a new default to the signed-in account. */
    saveDefaultPointSystem: (system: PointSystem) => Promise<void>;
}

// The account default is remembered per user so pages start on it without waiting for the profile request.
const storageKey = (userId: string) => `pointSystem:${userId}`;

const readStored = (userId: string | undefined): PointSystem => {
    if (!userId) return DEFAULT_POINT_SYSTEM;
    try {
        const stored = localStorage.getItem(storageKey(userId));
        return isPointSystem(stored) ? stored : DEFAULT_POINT_SYSTEM;
    } catch {
        return DEFAULT_POINT_SYSTEM;
    }
};

const writeStored = (userId: string, system: PointSystem) => {
    try {
        localStorage.setItem(storageKey(userId), system);
    } catch {
        // Storage can be blocked (private mode); the profile request still supplies the value.
    }
};

const currentUserId = (): string | undefined => (isAuthenticated() ? getUser()?.sub : undefined);

const PointSystemContext = createContext<PointSystemContextValue | null>(null);

/** Supplies the account's default point system. Must sit inside the Router (it re-checks the user on navigation). */
export const PointSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [userId, setUserId] = useState<string | undefined>(currentUserId);
    const [defaultPointSystem, setDefaultPointSystem] = useState<PointSystem>(() => readStored(currentUserId()));

    // Login and logout both navigate, so checking on navigation picks up a change of user.
    useEffect(() => {
        setUserId(currentUserId());
    }, [location.pathname]);

    useEffect(() => {
        setDefaultPointSystem(readStored(userId));
        if (!userId) return;

        let cancelled = false;
        getProfile()
            .then(profile => {
                if (cancelled || !isPointSystem(profile.pointSystem)) return;
                setDefaultPointSystem(profile.pointSystem);
                writeStored(userId, profile.pointSystem);
            })
            .catch(() => { /* Keep the remembered value; pages still work with it. */ });
        return () => { cancelled = true; };
    }, [userId]);

    const saveDefaultPointSystem = useCallback(async (system: PointSystem) => {
        const profile = await setProfilePointSystem(system);
        setDefaultPointSystem(profile.pointSystem);
        if (userId) writeStored(userId, profile.pointSystem);
    }, [userId]);

    const value = useMemo<PointSystemContextValue>(
        () => ({ defaultPointSystem, saveDefaultPointSystem }),
        [defaultPointSystem, saveDefaultPointSystem],
    );

    return <PointSystemContext.Provider value={value}>{children}</PointSystemContext.Provider>;
};

export const usePointSystem = (): PointSystemContextValue => {
    const context = useContext(PointSystemContext);
    if (!context) throw new Error('usePointSystem must be used inside a PointSystemProvider');
    return context;
};

/**
 * A page's point system: starts on (and follows) the account default until the viewer picks
 * another one on that page. The page choice is not saved and resets when they leave the page.
 */
export const usePagePointSystem = () => {
    const { defaultPointSystem } = usePointSystem();
    const [override, setOverride] = useState<PointSystem | null>(null);
    const pointSystem = override ?? defaultPointSystem;

    const setPointSystem = useCallback(
        (system: PointSystem) => setOverride(system === defaultPointSystem ? null : system),
        [defaultPointSystem],
    );
    const pointsFor = useCallback((unit: Unit | undefined | null) => getUnitPoints(unit, pointSystem), [pointSystem]);

    return { pointSystem, setPointSystem, pointsFor, defaultPointSystem, isOverridden: override !== null };
};
