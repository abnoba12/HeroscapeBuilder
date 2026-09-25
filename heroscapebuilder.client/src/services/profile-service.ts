import AxiosSingletonService from './AxiosSingletonService';
import { saveRefreshToken, saveToken } from './authService';
import { PointSystem } from '../models/point-system';

const api = AxiosSingletonService.getInstance();

export interface Profile {
    email: string;
    /** The point system pages default to for this account. */
    pointSystem: PointSystem;
}

export const getProfile = async (): Promise<Profile> =>
    (await api.get<Profile>(`/Profile/GetProfile`)).data;

export const setProfilePointSystem = async (pointSystem: PointSystem): Promise<Profile> =>
    (await api.put<Profile>(`/Profile/SetPointSystem`, { pointSystem })).data;

/** Changes the password. The server issues fresh tokens for this session, which are saved here. */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await api.post<{ token: string; refreshToken: string }>(`/Profile/ChangePassword`, { currentPassword, newPassword });
    saveToken(response.data.token);
    saveRefreshToken(response.data.refreshToken);
};

/** Permanently deletes the signed-in account. The caller is responsible for logging out afterwards. */
export const deleteAccount = async (password: string): Promise<void> => {
    await api.post(`/Profile/DeleteAccount`, { password });
};
