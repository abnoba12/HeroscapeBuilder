import axios from 'axios';
import { Unit } from '../models/unit';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getUnits = async () => {
    try {
        const response = await axios.get<Unit[]>(`${API_BASE_URL}/Unit`);
        return response.data;
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