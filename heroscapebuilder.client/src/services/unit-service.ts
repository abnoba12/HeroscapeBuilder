import { Unit } from '../models/unit';
import { GetAPIDataWithCache } from './cache-manager';
import { debounce } from './debounce';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getUnits = debounce(async () => {
    try {
        return GetAPIDataWithCache<Unit[]>(`${API_BASE_URL}/Unit`, "Unit");
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
});

export const getUnitsByCardType = debounce(async (cardSize: string) => {
    try {
        const response = await getUnits();
        return response.map(x => x.files.filter(y => y.filePurpose == `${cardSize}_Army_Card`))

    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
});