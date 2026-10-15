import AxiosSingletonService from './AxiosSingletonService';
import { isAuthenticated } from './authService';
import { localGetMyTerrain, localSetMyTerrain } from './local-db/local-api';

const api = AxiosSingletonService.getInstance();

export interface MyTerrainItem {
    terrainTypeId: number;
    terrainSizeId: number;
    quantity: number;
}

export const getMyTerrain = async (): Promise<MyTerrainItem[]> =>
    isAuthenticated() ? (await api.get<MyTerrainItem[]>('/UserTerrain/GetMyTerrain')).data : localGetMyTerrain();

export const setMyTerrain = async (terrain: MyTerrainItem[]): Promise<MyTerrainItem[]> =>
    isAuthenticated() ? (await api.post<MyTerrainItem[]>('/UserTerrain/SetMyTerrain', terrain)).data : localSetMyTerrain(terrain);
