import { useEffect, useState } from 'react';
import { isAuthenticated } from './authService';
import { getMyTerrain } from './my-terrain-service';
import { getProfile } from './profile-service';

export interface MyTerrainState {
    signedIn: boolean;
    /** Owned tile counts keyed "typeId:sizeId"; null until loaded (or when signed out). */
    owned: Map<string, number> | null;
    /** The profile's "allow tile swap" setting. */
    allowSwap: boolean;
}

/** The signed-in user's saved terrain and tile swap setting, for pages that compare maps to what the user owns. */
export const useMyTerrain = (): MyTerrainState => {
    const signedIn = isAuthenticated();
    const [owned, setOwned] = useState<Map<string, number> | null>(null);
    const [allowSwap, setAllowSwap] = useState(false);

    useEffect(() => {
        if (!signedIn) return;
        getMyTerrain()
            .then(items => setOwned(new Map(items.map(i => [`${i.terrainTypeId}:${i.terrainSizeId}`, i.quantity]))))
            .catch(() => setOwned(new Map()));
        getProfile().then(profile => setAllowSwap(profile.allowTileSwap)).catch(() => setAllowSwap(false));
    }, [signedIn]);

    return { signedIn, owned, allowSwap };
};
