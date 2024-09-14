import { UnitFile } from '../models/unit-file';
import { GetWithCache } from './cache-manager';

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getFilesByPurpose = async (purpose:string) => {
    try {
        return await GetWithCache<UnitFile[]>(`/File/GetFilesByPurpose?purpose=${purpose}`, `/File?purpose=${purpose}`, 3600);
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
};