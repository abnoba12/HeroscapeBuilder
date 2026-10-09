import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export interface MyTerrainItem {
    terrainTypeId: number;
    terrainSizeId: number;
    quantity: number;
}

export const getMyTerrain = async (): Promise<MyTerrainItem[]> =>
    (await api.get<MyTerrainItem[]>('/UserTerrain/GetMyTerrain')).data;

export const setMyTerrain = async (terrain: MyTerrainItem[]): Promise<MyTerrainItem[]> =>
    (await api.post<MyTerrainItem[]>('/UserTerrain/SetMyTerrain', terrain)).data;
