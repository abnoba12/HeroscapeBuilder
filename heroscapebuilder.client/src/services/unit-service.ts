import { Unit } from '../models/unit';
import { GetAPIDataWithCache } from './cache-manager';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getUnits = async () => {
    try {
        return GetAPIDataWithCache<Unit[]>(`${API_BASE_URL}/Unit`, "Unit");
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

export const getUnitsByCardType = async (cardSize: string) => {
    try {
        const response = await getUnits();
        let d = response;
        return d.map(x => x.files.filter(y => y.filePurpose == `${cardSize}_Army_Card`))

    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};