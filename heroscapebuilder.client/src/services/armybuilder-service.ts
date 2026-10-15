import { isAxiosError } from 'axios';
import AxiosSingletonService from './AxiosSingletonService';
import { isAuthenticated } from './authService';
import * as local from './local-db/local-api';
import {
    ArmyGame,
    ArmyGameRequest,
    ArmyTally,
    ArmyBuilder,
    ArmyBuilderSaveRequest,
    JournalEntry,
    JournalEntryRequest,
} from '../models/armybuilder';

const api = AxiosSingletonService.getInstance();

export const getMyArmyBuilders = async (): Promise<ArmyBuilder[]> => {
    if (!isAuthenticated()) return local.localGetMyArmyBuilders();
    return (await api.get<ArmyBuilder[]>(`/ArmyBuilder/GetMyArmyBuilders`)).data;
};

export const getArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localGetArmyBuilder(id);
    return (await api.get<ArmyBuilder>(`/ArmyBuilder/GetArmyBuilder`, { params: { id } })).data;
};

export const createArmyBuilder = async (request: ArmyBuilderSaveRequest): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localCreateArmyBuilder(request);
    return (await api.post<ArmyBuilder>(`/ArmyBuilder/CreateArmyBuilder`, request)).data;
};

export const updateArmyBuilder = async (id: number, request: ArmyBuilderSaveRequest): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localUpdateArmyBuilder(id, request);
    return (await api.put<ArmyBuilder>(`/ArmyBuilder/UpdateArmyBuilder`, request, { params: { id } })).data;
};

/** Deletes the whole army, every variation of it included. */
export const deleteArmyBuilder = async (id: number): Promise<void> => {
    if (!isAuthenticated()) {
        await local.localDeleteArmyBuilder(id);
        return;
    }
    await api.delete(`/ArmyBuilder/DeleteArmyBuilder`, { params: { id } });
}

/** Deletes one variation and returns the variation to show next. */
export const deleteVariation = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localDeleteVariation(id);
    return (await api.delete<ArmyBuilder>(`/ArmyBuilder/DeleteVariation`, { params: { id } })).data;
};

export const shareArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localShareArmyBuilder();
    return (await api.post<ArmyBuilder>(`/ArmyBuilder/ShareArmyBuilder`, null, { params: { id } })).data;
};

export const hideArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localShareArmyBuilder();
    return (await api.post<ArmyBuilder>(`/ArmyBuilder/HideArmyBuilder`, null, { params: { id } })).data;
};

/** Hides the army from the active list on My Armies. Nothing else about it changes. */
export const retireArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localRetireArmyBuilder(id);
    return (await api.post<ArmyBuilder>(`/ArmyBuilder/RetireArmyBuilder`, null, { params: { id } })).data;
};

export const restoreArmyBuilder = async (id: number): Promise<ArmyBuilder> => {
    if (!isAuthenticated()) return local.localRestoreArmyBuilder(id);
    return (await api.post<ArmyBuilder>(`/ArmyBuilder/RestoreArmyBuilder`, null, { params: { id } })).data;
};

export const getJournal = async (id: number): Promise<JournalEntry[]> => {
    if (!isAuthenticated()) return local.localGetJournal(id);
    return (await api.get<JournalEntry[]>(`/ArmyBuilder/GetJournal`, { params: { id } })).data;
};

export const addJournalEntry = async (id: number, request: JournalEntryRequest): Promise<JournalEntry> => {
    if (!isAuthenticated()) return local.localAddJournalEntry(id, request);
    return (await api.post<JournalEntry>(`/ArmyBuilder/AddJournalEntry`, request, { params: { id } })).data;
};

export const updateJournalEntry = async (entryId: number, request: JournalEntryRequest): Promise<JournalEntry> => {
    if (!isAuthenticated()) return local.localUpdateJournalEntry(entryId, request);
    return (await api.put<JournalEntry>(`/ArmyBuilder/UpdateJournalEntry`, request, { params: { entryId } })).data;
};

export const deleteJournalEntry = async (entryId: number): Promise<void> => {
    if (!isAuthenticated()) {
        await local.localDeleteJournalEntry(entryId);
        return;
    }
    await api.delete(`/ArmyBuilder/DeleteJournalEntry`, { params: { entryId } });
}

export const getArmyGames = async (id: number): Promise<ArmyGame[]> => {
    if (!isAuthenticated()) return local.localGetArmyGames(id);
    return (await api.get<ArmyGame[]>(`/ArmyBuilder/GetGames`, { params: { id } })).data;
};

/** Records one result (or `count` identical past results) and returns the army's new tally. */
export const logArmyGames = async (id: number, request: ArmyGameRequest): Promise<ArmyTally> => {
    if (!isAuthenticated()) return local.localLogArmyGames(id, request);
    return (await api.post<ArmyTally>(`/ArmyBuilder/LogGames`, request, { params: { id } })).data;
};

/** Removes a logged result and returns the army's new tally. */
export const deleteArmyGame = async (gameId: number): Promise<ArmyTally> => {
    if (!isAuthenticated()) return local.localDeleteArmyGame(gameId);
    return (await api.delete<ArmyTally>(`/ArmyBuilder/DeleteGame`, { params: { gameId } })).data;
};

/** Public endpoint - works without signing in. */
export const getSharedArmyBuilder = async (shareId: string, variationId?: number): Promise<ArmyBuilder> =>
    (await api.get<ArmyBuilder>(`/ArmyBuilder/GetSharedArmyBuilder`, { params: { shareId, variationId } })).data;

export const buildShareUrl = (shareId: string): string => `${window.location.origin}/armybuilder/${shareId}`;

/** Pulls the validation messages the API returns ({ errors: string[] }), falling back to a generic message. */
export const getErrorMessages = (error: unknown, fallback = 'Something went wrong. Please try again.'): string[] => {
    if (isAxiosError(error)) {
        const errors = error.response?.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
            return errors.map(String);
        }
    }
    return [fallback];
};

export const isNotFound = (error: unknown): boolean => isAxiosError(error) && error.response?.status === 404;
