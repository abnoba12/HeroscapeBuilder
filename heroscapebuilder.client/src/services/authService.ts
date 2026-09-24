import { jwtDecode } from "jwt-decode";
import AxiosSingletonService from "./AxiosSingletonService";

interface JwtPayload {
    sub: string;
    exp: number;
    roles?: string[];
    [key: string]: any;
}

const api = AxiosSingletonService.getInstance();

/** Creates the account and emails a verification link. Resolves to whether that email went out. */
export const register = async (email: string, password: string): Promise<boolean> => {
    const response = await api.post<{ emailSent: boolean }>(`/auth/register`, { email, password });
    return response.data.emailSent;
};

export const confirmEmail = async (userId: string, token: string): Promise<void> => {
    await api.post(`/auth/confirmEmail`, { userId, token });
};

export const resendVerification = async (email: string): Promise<void> => {
    await api.post(`/auth/resendVerification`, { email });
};

export const login = async (email: string, password: string): Promise<void> => {
    const response = await api.post<{ token: string; refreshToken: string }>(`/auth/login`, {
        email,
        password,
    });
    saveToken(response.data.token);
    saveRefreshToken(response.data.refreshToken);
};

export const refreshToken = async (): Promise<void> => {
    try {
        const storedRefreshToken = getRefreshToken();
        if (!storedRefreshToken) {
            throw new Error("No refresh token available to refresh.");
        }

        const response = await api.post<{ token: string; refreshToken: string }>(`/auth/refresh`, {
            refreshToken: storedRefreshToken,
        });
        saveToken(response.data.token);
        saveRefreshToken(response.data.refreshToken);
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

export const saveRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem("refreshToken");
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
    localStorage.removeItem("refreshToken");
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

// Track user activity so an idle tab is allowed to expire, while an active one renews silently.
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
const ACTIVE_WINDOW_MS = 5 * 60 * 1000; // user counts as "active" if they interacted in the last 5 minutes
const RENEWAL_CHECK_INTERVAL_MS = 30 * 1000;
const RENEWAL_THRESHOLD_MS = 2 * 60 * 1000; // start attempting renewal 2 minutes before expiry

let lastActivityAt = Date.now();

if (typeof window !== "undefined") {
    ACTIVITY_EVENTS.forEach((eventName) => {
        window.addEventListener(
            eventName,
            () => {
                lastActivityAt = Date.now();
            },
            { passive: true }
        );
    });

    setInterval(async () => {
        const token = getToken();
        if (!token || isRefreshing) return;

        const { exp } = jwtDecode<JwtPayload>(token);
        const msUntilExpiry = exp * 1000 - Date.now();
        const isActive = Date.now() - lastActivityAt < ACTIVE_WINDOW_MS;

        if (msUntilExpiry > 0 && msUntilExpiry < RENEWAL_THRESHOLD_MS && isActive) {
            isRefreshing = true;
            try {
                await refreshToken();
                onAccessTokenRefreshed(getToken()!);
            } catch (error) {
                console.error("Silent token renewal failed:", error);
            } finally {
                isRefreshing = false;
            }
        }
    }, RENEWAL_CHECK_INTERVAL_MS);
}