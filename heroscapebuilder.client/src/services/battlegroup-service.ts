import { isAxiosError } from 'axios';
import AxiosSingletonService from './AxiosSingletonService';
import { ArmyGame, ArmyGameRequest, ArmyTally, Battlegroup, BattlegroupSaveRequest } from '../models/battlegroup';

const api = AxiosSingletonService.getInstance();

export const getMyBattlegroups = async (): Promise<Battlegroup[]> =>
    (await api.get<Battlegroup[]>(`/Battlegroup/GetMyBattlegroups`)).data;

export const getBattlegroup = async (id: number): Promise<Battlegroup> =>
    (await api.get<Battlegroup>(`/Battlegroup/GetBattlegroup`, { params: { id } })).data;

export const createBattlegroup = async (request: BattlegroupSaveRequest): Promise<Battlegroup> =>
    (await api.post<Battlegroup>(`/Battlegroup/CreateBattlegroup`, request)).data;

export const updateBattlegroup = async (id: number, request: BattlegroupSaveRequest): Promise<Battlegroup> =>
    (await api.put<Battlegroup>(`/Battlegroup/UpdateBattlegroup`, request, { params: { id } })).data;

export const deleteBattlegroup = async (id: number): Promise<void> => {
    await api.delete(`/Battlegroup/DeleteBattlegroup`, { params: { id } });
};

export const shareBattlegroup = async (id: number): Promise<Battlegroup> =>
    (await api.post<Battlegroup>(`/Battlegroup/ShareBattlegroup`, null, { params: { id } })).data;

export const hideBattlegroup = async (id: number): Promise<Battlegroup> =>
    (await api.post<Battlegroup>(`/Battlegroup/HideBattlegroup`, null, { params: { id } })).data;

export const getArmyGames = async (id: number): Promise<ArmyGame[]> =>
    (await api.get<ArmyGame[]>(`/Battlegroup/GetGames`, { params: { id } })).data;

/** Records one result (or `count` identical past results) and returns the army's new tally. */
export const logArmyGames = async (id: number, request: ArmyGameRequest): Promise<ArmyTally> =>
    (await api.post<ArmyTally>(`/Battlegroup/LogGames`, request, { params: { id } })).data;

/** Removes a logged result and returns the army's new tally. */
export const deleteArmyGame = async (gameId: number): Promise<ArmyTally> =>
    (await api.delete<ArmyTally>(`/Battlegroup/DeleteGame`, { params: { gameId } })).data;

/** Public endpoint - works without signing in. */
export const getSharedBattlegroup = async (shareId: string): Promise<Battlegroup> =>
    (await api.get<Battlegroup>(`/Battlegroup/GetSharedBattlegroup`, { params: { shareId } })).data;

export const buildShareUrl = (shareId: string): string => `${window.location.origin}/battlegroup/${shareId}`;

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
