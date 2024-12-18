import axios, { AxiosInstance } from "axios";

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
                    if (token) {
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
