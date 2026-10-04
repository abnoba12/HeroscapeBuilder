import { useEffect, useState } from 'react';
import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export interface UnitPowerRank {
    armyCardId: number;
    /** 1 is the strongest. */
    rank: number;
}

export interface PowerRankingSummary {
    rankedCount: number;
    units: UnitPowerRank[];
}

export interface DuelPair {
    armyCardAId: number;
    armyCardBId: number;
}

export interface PowerBalanceRow {
    armyCardId: number;
    name?: string;
    creator?: string;
    points: number;
    pointsRank: number;
    /** Rank by the combined rating (duels plus results). */
    powerRank: number;
    duelRank: number;
    /** Null until the unit has enough logged games from enough players. */
    resultsRank: number | null;
    rankDelta: number;
    rating: number;
    seedRating: number;
    ratingDelta: number;
    votes: number;
    dependsVotes: number;
    games: number;
    gamePlayers: number;
}

// One shared request: the unit page, the tower and the widgets all read the same ranking. It is reused for a
// short while so navigating around is cheap, but not so long that someone's votes never seem to change anything.
const RANKING_MAX_AGE_MS = 30 * 1000;
let rankingPromise: Promise<PowerRankingSummary> | null = null;
let rankingLoadedAt = 0;

export const loadPowerRanking = (): Promise<PowerRankingSummary> => {
    if (rankingPromise && Date.now() - rankingLoadedAt > RANKING_MAX_AGE_MS) {
        rankingPromise = null;
    }
    if (!rankingPromise) {
        rankingLoadedAt = Date.now();
        rankingPromise = api.get<PowerRankingSummary>('/PowerRanking/GetRankings')
            .then(response => response.data)
            .catch(error => {
                rankingPromise = null;
                throw error;
            });
    }
    return rankingPromise;
};

/** The ranking, or null while loading / if it could not be loaded (callers simply show nothing). */
export const usePowerRanking = (): PowerRankingSummary | null => {
    const [summary, setSummary] = useState<PowerRankingSummary | null>(null);

    useEffect(() => {
        let cancelled = false;
        loadPowerRanking()
            .then(result => { if (!cancelled) setSummary(result); })
            .catch(() => { /* The ranking is a nice-to-have; pages work without it. */ });
        return () => { cancelled = true; };
    }, []);

    return summary;
};

const VISITOR_ID_KEY = 'powerDuelVisitorId';

/**
 * A random id this browser keeps so anonymous duels are not repeated and can be merged into the account
 * if the visitor signs in later. Falls back to a per-page id when storage is blocked.
 */
let fallbackVisitorId: string | null = null;
const getVisitorId = (): string => {
    try {
        let id = localStorage.getItem(VISITOR_ID_KEY);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(VISITOR_ID_KEY, id);
        }
        return id;
    } catch {
        fallbackVisitorId ??= crypto.randomUUID();
        return fallbackVisitorId;
    }
};

const visitorHeaders = () => ({ 'X-Visitor-Id': getVisitorId() });

/** Works signed in or not. Null when there is no next pair (everything on offer has been answered). */
export const getNextDuel = async (): Promise<DuelPair | null> => {
    const response = await api.get<DuelPair>('/PowerRanking/GetNextDuel', { headers: visitorHeaders() });
    return response.status === 204 ? null : response.data;
};

/** Works signed in or not. Pass the preferred unit's id, or null for "it depends". */
export const submitDuelVote = async (pair: DuelPair, preferredArmyCardId: number | null): Promise<void> => {
    await api.post('/PowerRanking/Vote', { ...pair, preferredArmyCardId }, { headers: visitorHeaders() });
};

export const getPowerBalanceReport = async (): Promise<PowerBalanceRow[]> =>
    (await api.get<PowerBalanceRow[]>('/PowerRanking/GetBalanceReport')).data;
