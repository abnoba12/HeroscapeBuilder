import axios from 'axios';
import { debounce } from './debounce';
import { getToken } from './authService';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;
const api = axios.create();

export const getMyUnits = debounce(async () => {
    try {
        return await api.get(`${API_BASE_URL}/MyArmy/GetMyUnits`, {
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