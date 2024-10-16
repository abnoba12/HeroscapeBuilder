import axios from 'axios';
import { base64ToBlob, blobToBase64 } from './image-service';

// Create an instance of axios
const api = axios.create();
const defaultCacheDuration = 60;
const debug = false;

// REST Function to fetch data with caching
export const GetAPIDataWithCache = async <T>(url: string, cacheKey: string, cacheDuration: number = defaultCacheDuration): Promise<T> => {       
    try {
        if (!url || !cacheKey) {
            throw "Missing required parameters";
        }

        var response = await getCache<T>(
            cacheKey,
            async () => (await api.get(url)).data,
            cacheDuration
        );        

        return response;
    } catch (apiError) {
        console.error('Error making API call:', apiError);
        throw apiError; // Rethrow the error so the caller knows it failed
    }
};

export const blobCache = async (url: string, cacheKey: string, cacheDuration: number = defaultCacheDuration) => {
    let blob: Blob = new Blob();
    try {
        if (!url || !cacheKey) {
            throw "Missing required parameters";
        }

        var response = await getCache<string>(
            cacheKey,
            async () => blobToBase64((await api.get(url, { responseType: 'blob' })).data),
            cacheDuration
        ); 

        return base64ToBlob(response);
    } catch (error) {
        console.warn('Error reading from cache, proceeding without cache:', error);
    }
    return blob;
};

export const base64Cache = async (url: string, cacheKey: string, cacheDuration: number = defaultCacheDuration) => {
    if (!url || !cacheKey) {
        throw "Missing required parameters";
    }

    return await getCache<string>(
        cacheKey,
        async () => blobToBase64((await api.get(url, { responseType: 'blob' })).data),
        cacheDuration
    );
}

// Generic type for the cache response
type CacheData<T> = {
    data: T;
    timestamp: Date;
    cacheDuration: number;
};

// Core function to manage cache across storage layers
export const getCache = async <T>(
    cacheKey: string,
    dataFunction: () => T | Promise<T>, // DataFunction can be synchronous or asynchronous
    cacheDuration: number = defaultCacheDuration // Cache duration in minutes
): Promise<T> => {
    const now = new Date().getTime();
    const cacheDurationMs = cacheDuration * 60 * 1000; // Convert minutes to milliseconds

    cleanExpiredCache();

    // Check multiple storage options: SessionStorage, LocalStorage, CacheStorage, IndexedDB
    let cachedData = await checkCache<T>(cacheKey, cacheDurationMs, now);

    if (cachedData) {
        return cachedData;
    }

    // Cache not found or expired, run DataFunction
    try {
        const result = await Promise.resolve(dataFunction()); // Ensure it works for both sync and async functions

        const cacheEntry: CacheData<T> = {
            data: result,
            timestamp: new Date(),
            cacheDuration,
        };

        // Try to save in each storage layer in order
        trySaveInSessionStorage(cacheKey, cacheEntry);

        return result;
    } catch (error) {
        console.error('Error fetching data via DataFunction:', error);
        throw error;
    }
};

// Check cache in multiple layers
const checkCache = async <T>(cacheKey: string, cacheDurationMs: number, now: number): Promise<T | null> => {
    // Check in SessionStorage
    let cachedData: CacheData<T> | null = checkLocalStorage(sessionStorage, cacheKey, cacheDurationMs, now);
    if (cachedData) return cachedData.data;

    // Check in LocalStorage
    cachedData = checkLocalStorage(localStorage, cacheKey, cacheDurationMs, now);
    if (cachedData) return cachedData.data;

    // Check in CacheStorage
    cachedData = await checkCacheStorage<T>(cacheKey, cacheDurationMs, now);
    if (cachedData) return cachedData.data;

    // Check in IndexedDB
    cachedData = await checkIndexedDB<T>(cacheKey, cacheDurationMs, now);
    if (cachedData) return cachedData.data;

    return null;
};

// Generic cache checker for localStorage or sessionStorage
const checkLocalStorage = <T>(
    storage: Storage,
    cacheKey: string,
    cacheDurationMs: number,
    now: number
): CacheData<T> | null => {
    const cachedData = storage.getItem(cacheKey);
    if (!cachedData) return null;

    try {
        const parsedData: CacheData<T> = JSON.parse(cachedData);
        if (now - new Date(parsedData.timestamp).getTime() < cacheDurationMs) {
            return parsedData;
        } else {
            storage.removeItem(cacheKey);
        }
    } catch (error) {
        console.warn(`Error reading from ${storage === localStorage ? 'LocalStorage' : 'SessionStorage'}:`, error);
    }
    return null;
};

// Check CacheStorage
const checkCacheStorage = async <T>(
    cacheKey: string,
    cacheDurationMs: number,
    now: number
): Promise<CacheData<T> | null> => {
    if (!('caches' in window)) return null;
    try {
        const cache = await caches.open('my-cache');
        const cachedResponse = await cache.match(cacheKey);
        if (!cachedResponse) return null;

        const cachedText = await cachedResponse.text();
        const parsedData: CacheData<T> = JSON.parse(cachedText);

        if (now - new Date(parsedData.timestamp).getTime() < cacheDurationMs) {
            return parsedData;
        } else {
            await cache.delete(cacheKey);
        }
    } catch (error) {
        console.warn('Error reading from CacheStorage:', error);
    }
    return null;
};

// Check IndexedDB
const checkIndexedDB = async <T>(
    cacheKey: string,
    cacheDurationMs: number,
    now: number
): Promise<CacheData<T> | null> => {
    if (!('indexedDB' in window)) return null;
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('cacheStore', 'readonly');
        const store = transaction.objectStore('cacheStore');
        const request = store.get(cacheKey);

        return new Promise<CacheData<T> | null>((resolve, reject) => {
            request.onsuccess = () => {
                const cacheData = request.result; // Access the result from the IDBRequest

                if (cacheData && now - new Date(cacheData.timestamp).getTime() < cacheDurationMs) {
                    resolve(cacheData);
                } else if (cacheData) {
                    // Cache expired, delete the entry
                    const deleteTx = db.transaction('cacheStore', 'readwrite');
                    deleteTx.objectStore('cacheStore').delete(cacheKey);
                    resolve(null); // Cache is expired, so return null
                } else {
                    resolve(null); // No data found
                }
            };

            request.onerror = () => {
                console.warn('Error reading from IndexedDB:', request.error);
                reject(request.error); // Handle the error
            };
        });
    } catch (error) {
        console.warn('Error reading from IndexedDB:', error);
        return null;
    }
};

// Try to save in each storage layer
const trySaveInSessionStorage = async <T>(cacheKey: string, cacheEntry: CacheData<T>): Promise<void> => {
    // Try to save in sessionStorage
    if (!trySaveInLocalStorage(sessionStorage, cacheKey, cacheEntry)) {
        // Try to save in localStorage
        if (!trySaveInLocalStorage(localStorage, cacheKey, cacheEntry)) {
            // Try to save in CacheStorage
            try {
                const cache = await caches.open('my-cache');
                const response = new Response(JSON.stringify(cacheEntry));
                await cache.put(cacheKey, response);
            } catch (error) {
                console.warn('Error saving to CacheStorage:', error);
            }

            // Try to save in IndexedDB
            try {
                const db = await openIndexedDB();
                const transaction = db.transaction('cacheStore', 'readwrite');
                const store = transaction.objectStore('cacheStore');
                await store.put(cacheEntry, cacheKey);
            } catch (error) {
                console.warn('Error saving to IndexedDB:', error);
            }
        }
    }
};

// Try to save in localStorage or sessionStorage
const trySaveInLocalStorage = <T>(storage: Storage, cacheKey: string, cacheEntry: CacheData<T>): boolean => {
    try {
        storage.setItem(cacheKey, JSON.stringify(cacheEntry));
        return true;
    } catch (error: any) {
        if (error.name === 'QuotaExceededError') {
            console.warn(`${storage === localStorage ? 'LocalStorage' : 'SessionStorage'} is full.`);
        } else {
            console.warn('Error saving cache:', error);
        }
    }
    return false;
};

// Open IndexedDB and create object store
const openIndexedDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('my-cache-db', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore('cacheStore');
        };
    });
};

// Remove cache entry from all storages
export const removeCache = async (key: string) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    try {
        const cache = await caches.open('my-cache');
        await cache.delete(key);
    } catch (error) {
        console.warn('Error removing from CacheStorage:', error);
    }
    try {
        const db = await openIndexedDB();
        const transaction = db.transaction('cacheStore', 'readwrite');
        transaction.objectStore('cacheStore').delete(key);
    } catch (error) {
        console.warn('Error removing from IndexedDB:', error);
    }
};

// Clean up expired cache entries in localStorage, sessionStorage, CacheStorage, and IndexedDB
const CACHE_CLEAN_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_CLEAN_TIME_KEY = 'lastCacheCleanTime';
export const cleanExpiredCache = async (): Promise<void> => {
    const now = new Date().getTime();

    // Retrieve the last clean time from localStorage
    const lastCleanTime = localStorage.getItem(LAST_CLEAN_TIME_KEY);

    // If the cache was cleaned less than 5 minutes ago, return early
    if (lastCleanTime && now - parseInt(lastCleanTime) < CACHE_CLEAN_INTERVAL) {
        if (debug) console.log('Cache was cleaned recently, skipping cleanup.');
        return;
    }

    // Update the last clean time in localStorage
    localStorage.setItem(LAST_CLEAN_TIME_KEY, now.toString());

    // Clean sessionStorage and localStorage
    [localStorage, sessionStorage].forEach(storage => {
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) {
                const cachedData = storage.getItem(key);
                if (cachedData) {
                    try {
                        const parsedData: CacheData<any> = JSON.parse(cachedData);
                        if (now - new Date(parsedData.timestamp).getTime() > parsedData.cacheDuration * 60 * 1000) {
                            storage.removeItem(key);
                        }
                    } catch (e) {
                        console.warn(`Failed to parse cache data for key: ${key}`, e);
                    }
                }
            }
        }
    });

    // Clean CacheStorage
    const cache = await caches.open('my-cache');
    const keys = await cache.keys();

    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            if (response.headers.get('content-type')?.includes('application/json')) {
                try {
                    const parsedData = await response.json();
                    if (now - new Date(parsedData.timestamp).getTime() > parsedData.cacheDuration * 60 * 1000) {
                        await cache.delete(request);
                    }
                } catch (error) {
                    console.warn('Error parsing JSON response', error);
                }
            }
        }
    }

    // Clean IndexedDB
    openIndexedDB().then(db => {
        const transaction = db.transaction('cacheStore', 'readwrite');
        const store = transaction.objectStore('cacheStore');
        store.openCursor().onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result; // Type assertion here
            if (cursor) {
                const cachedData: CacheData<any> = cursor.value;
                if (now - new Date(cachedData.timestamp).getTime() > cachedData.cacheDuration * 60 * 1000) {
                    store.delete(cursor.primaryKey);
                }
                cursor.continue();
            }
        };
    });

    if (debug) console.log('Cache cleaned at', new Date(now));
};
