import { blobToBase64 } from './image-service';

// Assets are cached by the browser's own HTTP cache (the server/proxy sends Cache-Control headers), which has a large
// quota, lives on disk and evicts itself. We deliberately don't copy them into localStorage/IndexedDB/CacheStorage.

const fetchBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    return response.blob();
};

export const blobCache = async (url: string, _cacheKey?: string): Promise<Blob> => {
    if (!url) {
        throw "Missing required parameters";
    }
    return fetchBlob(url);
};

// Card blanks are reused for every card in a batch, so memoize the (small) base64 conversion for this page session only.
const base64Memo = new Map<string, Promise<string>>();

export const base64Cache = async (url: string, _cacheKey?: string): Promise<string> => {
    if (!url) {
        throw "Missing required parameters";
    }

    let pending = base64Memo.get(url);
    if (!pending) {
        pending = fetchBlob(url).then(blobToBase64);
        base64Memo.set(url, pending);
        pending.catch(() => base64Memo.delete(url)); // don't memoize failures
    }
    return pending;
};
