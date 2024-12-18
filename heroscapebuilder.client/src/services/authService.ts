import { jwtDecode } from "jwt-decode";
import AxiosSingletonService from "./AxiosSingletonService";

interface JwtPayload {
    sub: string;
    exp: number;
    roles?: string[];
    [key: string]: any;
}

const api = AxiosSingletonService.getInstance();

export const register = async (email: string, password: string): Promise<void> => {
    await api.post(`/auth/register`, { email, password });
};

export const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<{ token: string }>(`/auth/login`, {
        email,
        password,
    });
    saveToken(response.data.token);
};

export const refreshToken = async (): Promise<void> => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("No token available to refresh.");
        }

        const response = await api.post<{ token: string }>(`/auth/refresh`, {
            token,
        });
        saveToken(response.data.token);
    } catch (error) {
        console.error("Failed to refresh token", error);
        logout();
        throw error; // Ensure the error propagates
    }
};

export const saveToken = (token: string): void => {
    localStorage.setItem("jwt", token);
};

export const getToken = (): string | null => {
    return localStorage.getItem("jwt");
};

export const getUser = (): JwtPayload | null => {
    const token = getToken();
    if (token) {
        return jwtDecode<JwtPayload>(token);
    }
    return null;
};

export const logout = (): void => {
    localStorage.removeItem("jwt");
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() < exp * 1000;
};

export const hasRole = (role: string): boolean => {
    const user = getUser();
    return user?.roles?.includes(role) ?? false;
};

let isRefreshing = false; // Prevent concurrent token refresh
let subscribers: ((token: string) => void)[] = []; // Queue for requests waiting for token refresh

const addSubscriber = (callback: (token: string) => void) => {
    subscribers.push(callback);
};

const onAccessTokenRefreshed = (token: string) => {
    subscribers.forEach((callback) => callback(token));
    subscribers = [];
};

api.interceptors.request.use(async (config) => {
    // Skip interceptor for login or refresh requests
    if (
        config.url?.includes(`/auth/login`) ||
        config.url?.includes(`/auth/refresh`)
    ) {
        return config;
    }

    const token = getToken();
    if (token) {
        const { exp } = jwtDecode<JwtPayload>(token);

        // Check if the token is about to expire
        if (exp * 1000 - Date.now() < 60 * 1000) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await refreshToken();
                    isRefreshing = false;
                    const newToken = getToken();
                    onAccessTokenRefreshed(newToken!);
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                    isRefreshing = false;
                    logout();
                    throw error;
                }
            }

            // Queue the request while the token is refreshing
            return new Promise((resolve) => {
                addSubscriber((newToken) => {
                    config.headers.Authorization = `Bearer ${newToken}`;
                    resolve(config);
                });
            });
        }

        // Add the token to the request headers
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});