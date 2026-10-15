import { debounce } from './debounce';
import { getToken, isAuthenticated } from './authService';
import { localAddUnits, localDeleteUnits, localGetMyUnitCount, localGetMyUnits, localSetMyUnits } from './local-db/local-api';
import AxiosSingletonService from './AxiosSingletonService';
import type { AxiosResponse } from 'axios';
import type { Unit } from '../models/unit';

const api = AxiosSingletonService.getInstance();

/** Fired after My Army changes so the sidebar can show/hide the Army builders menu. */
export const MY_ARMY_CHANGED_EVENT = 'my-army-changed';

const notifyMyArmyChanged = () => window.dispatchEvent(new Event(MY_ARMY_CHANGED_EVENT));

export const getMyUnitCount = async (): Promise<number> => {
    if (!isAuthenticated()) return localGetMyUnitCount();
    return (await api.get<number>(`/MyArmy/GetMyUnitCount`)).data;
};

export const getMyUnits = debounce(async () => {
    try {
        if (!isAuthenticated()) {
            return { data: await localGetMyUnits() } as AxiosResponse<Unit[]>;
        }
        return await api.get(`/MyArmy/GetMyUnits`, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`
            }
        });
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
});

export const deleteUnits = async (unitIds: Array<number>) => {
    try {
        if (!isAuthenticated()) {
            await localDeleteUnits(unitIds);
            notifyMyArmyChanged();
            return;
        }
        const response = await api.delete(`/MyArmy/RemoveUnitsFromMyArmy`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            data: JSON.stringify(unitIds)
        });
        notifyMyArmyChanged();
        return response;
    } catch (error) {
        console.error('Error deleting units:', error);
        throw error;
    }
};

export const addUnits = async (unitIds: Array<number>) => {
    try {
        if (!isAuthenticated()) {
            await localAddUnits(unitIds);
            notifyMyArmyChanged();
            return;
        }
        const response = await api.post(`/MyArmy/AddUnitsToMyArmy`, JSON.stringify(unitIds), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
        notifyMyArmyChanged();
        return response;
    } catch (error) {
        console.error('Error adding units:', error);
        throw error;
    }
};

export const setMyUnits = async (units: Array<{ unitId: number, quantity: number }>) => {
    try {
        if (!isAuthenticated()) {
            await localSetMyUnits(units);
            notifyMyArmyChanged();
            return;
        }
        const response = await api.post(`/MyArmy/SetMyUnits`, JSON.stringify(units), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
        notifyMyArmyChanged();
        return response;
    } catch (error) {
        console.error('Error saving units:', error);
        throw error;
    }
};