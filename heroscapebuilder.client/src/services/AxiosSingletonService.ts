import axios, { AxiosInstance } from "axios";

const MAX_RETRIES = 3;

class AxiosSingletonService {
    private static instance: AxiosInstance;

    private constructor() {
        // Private constructor to prevent direct instantiation
    }

    public static getInstance(): AxiosInstance {
        if (!AxiosSingletonService.instance) {
            AxiosSingletonService.instance = axios.create({
                baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Add interceptors if necessary
            AxiosSingletonService.instance.interceptors.request.use(
                async (config) => {
                    const token = localStorage.getItem("jwt"); // Example token retrieval
                    // Only send the JWT to our own API, never to other hosts (e.g. the file/image server)
                    const isApiRequest = !/^https?:\/\//i.test(config.url ?? "") || (!!config.baseURL && (config.url ?? "").startsWith(config.baseURL));
                    if (token && isApiRequest) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );

            AxiosSingletonService.instance.interceptors.response.use(
                (response) => response,
                async (error) => {
                    // Retry idempotent GETs on transient failures (network drop, timeout, 5xx from a cold
                    // server / expired server cache). A manual refresh succeeding is the symptom this covers.
                    const config = error.config;
                    const status = error.response?.status;
                    const transient = !error.response || status === 408 || status === 429 || (status >= 500 && status <= 599);
                    if (config && config.method?.toLowerCase() === "get" && transient) {
                        config.__retryCount = (config.__retryCount ?? 0) + 1;
                        if (config.__retryCount <= MAX_RETRIES) {
                            console.warn(`GET ${config.url} failed (${status ?? error.code}), retry ${config.__retryCount}/${MAX_RETRIES}`);
                            await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** (config.__retryCount - 1)));
                            return AxiosSingletonService.instance.request(config);
                        }
                    }

                    if (error.response?.status === 401) {
                        console.error("Unauthorized, logging out...");
                        localStorage.removeItem("jwt"); // Clear token
                        // Optionally, redirect to login
                    }
                    return Promise.reject(error);
                }
            );
        }

        return AxiosSingletonService.instance;
    }
}

export default AxiosSingletonService;
