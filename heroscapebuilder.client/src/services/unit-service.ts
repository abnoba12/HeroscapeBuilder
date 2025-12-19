import AxiosSingletonService from './AxiosSingletonService';
import { debounce } from './debounce';

const api = AxiosSingletonService.getInstance();

export const getUnits = debounce(async () => {
    try {
        return (await api.get(`/Unit/GetAllUnits`)).data
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