import AxiosSingletonService from './AxiosSingletonService';
import { debounce } from './debounce';
import { Unit } from '../models/unit';
import { UnitFile } from '../models/unit-file';

const api = AxiosSingletonService.getInstance();

export const getUnits = debounce(async (): Promise<Unit[]> => {
    try {
        return (await api.get<Unit[]>(`/Unit/GetAllUnits`)).data;
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
});

export const getUnitsByCardType = debounce(async (cardSize: string) => {
    try {
        const response = await getUnits();
        return response.map((unit: Unit) =>
            unit.files.filter((file: UnitFile) => file.filePurpose == `${cardSize}_Army_Card`),
        );

    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
});
