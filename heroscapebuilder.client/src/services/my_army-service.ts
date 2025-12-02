import { debounce } from './debounce';
import { getToken } from './authService';
import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export const getMyUnits = debounce(async () => {
    try {
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
        return await api.delete(`/MyArmy/RemoveUnitsFromMyArmy`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            data: JSON.stringify(unitIds)
        });
    } catch (error) {
        console.error('Error deleting units:', error);
        throw error;
    }
};

export const addUnits = async (unitIds: Array<number>) => {
    try {
        return await api.post(`/MyArmy/AddUnitsToMyArmy`, JSON.stringify(unitIds), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
    } catch (error) {
        console.error('Error adding units:', error);
        throw error;
    }
};

export const setMyUnits = async (units: Array<{ unitId: number, quantity: number }>) => {
    try {
        return await api.post(`/MyArmy/SetMyUnits`, JSON.stringify(units), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        });
    } catch (error) {
        console.error('Error saving units:', error);
        throw error;
    }
};