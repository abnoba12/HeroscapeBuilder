import { Unit } from '../models/unit';
import { GetAPIDataWithCache } from './cache-manager';
import { debounce } from './debounce';

export const getUnits = debounce(async () => {
    try {
        return GetAPIDataWithCache<Unit[]>(`/Unit/GetAllUnits`, "Unit");
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