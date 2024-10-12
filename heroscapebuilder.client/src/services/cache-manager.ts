import axios, { AxiosResponse } from 'axios';
import { base64ToBlob, blobToBase64 } from './image-service';

// Create an instance of axios
const api = axios.create();

// Generic type for the response data
type ApiResponse<T> = AxiosResponse<T>;

// REST Function to fetch data with caching
export const GetWithCache = async <T>(url: string, cacheKey: string, cacheDuration = 3600): Promise<T> => {
    const now = new Date().getTime();
    // Clean up expired cache entries before proceeding
    cleanUpExpiredCache(cacheDuration);

    try {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);

        // If cached data exists and is not expired, return it
        if (cachedData && cachedTime && now - parseInt(cachedTime) < cacheDuration * 1000) {
            return JSON.parse(cachedData);
        }
    } catch (error) {
        console.warn('Error reading from cache, proceeding without cache:', error);
    }

    // Make the API call
    try {
        const response: ApiResponse<T> = await api.get(url);

        // Cache the result
        try {
            localStorage.setItem(cacheKey, JSON.stringify(response.data));
            localStorage.setItem(`${cacheKey}_time`, now.toString());
        } catch (cacheError) {
            console.warn('Error writing to cache, skipping cache storage:', cacheError);
        }

        return response.data;
    } catch (apiError) {
        console.error('Error making API call:', apiError);
        throw apiError; // Rethrow the error so the caller knows it failed
    }
};

export const blobCache = async (cacheKey: string, fetchFunc: () => Promise<Blob>, cacheDuration: number = 3600) => {
    // Clean up expired cache entries before proceeding
    cleanUpExpiredCache(cacheDuration);

    let blob: Blob = new Blob();
    try {
        const cachedBase64 = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(`${cacheKey}_time`);
        const now = new Date().getTime();

        // Check if the cache exists and is still valid
        if (cachedBase64 && cachedTime && now - parseInt(cachedTime) < cacheDuration * 1000) {
            blob = base64ToBlob(cachedBase64);
            return blob;
        }

        // Cache has expired or doesn't exist, fetch a new Blob
        blob = await fetchFunc();
        const base64Data = await blobToBase64(blob);

        // Store the Blob in Base64 format along with the current timestamp
        localStorage.setItem(cacheKey, base64Data);
        localStorage.setItem(`${cacheKey}_time`, now.toString());
    } catch (error) {
        console.warn('Error reading from cache, proceeding without cache:', error);
    }
    return blob;
};

// Clean up expired cache entries
const cleanUpExpiredCache = (cacheDuration: number) => {
    const now = new Date().getTime();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Skip non-time-related keys
        if (key && key.endsWith('_time')) {
            const cacheKey = key.replace('_time', '');
            const cachedTime = localStorage.getItem(key);

            if (cachedTime && now - parseInt(cachedTime) > cacheDuration * 1000) {
                // Remove the expired cache entry and its associated time entry
                localStorage.removeItem(cacheKey);
                localStorage.removeItem(key);
                console.log(`Removed expired cache: ${cacheKey}`);
            }
        }
    }
};