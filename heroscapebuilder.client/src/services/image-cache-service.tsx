import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { blobToBase64 } from './image-service';

// Create an instance of axios
const api = axios.create();

// Function to cache and retrieve images
export const fetchImageWithCache = async (url: string, cacheKey: string, cacheDuration = 86400): Promise<string> => {
    const now = new Date().getTime();
    const cachedImage = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);

    // If cached data exists and is not expired, return it
    if (cachedImage && cachedTime && now - parseInt(cachedTime) < cacheDuration * 1000) {
        return cachedImage; // Return cached Base64 string
    }

    // Fetch the image from the API
    const response = await api.get(url, { responseType: 'blob' });

    // Check if the response is a 200 OK
    if (response.status === 200) {
        // Convert the image blob to Base64
        const base64Image = await blobToBase64(response.data);

        // Attempt to cache the result
        try {
            localStorage.setItem(cacheKey, base64Image);
            localStorage.setItem(`${cacheKey}_time`, now.toString());
        } catch (error: any) {
            // Catch QuotaExceededError and fallback to just returning the image
            if (error.name === 'QuotaExceededError') {
                console.warn('LocalStorage quota exceeded, skipping caching.');
            } else {
                throw error;
            }
        }

        return base64Image;
    } else {
        throw new Error(`Failed to fetch image. Status code: ${response.status}`);
    }
};


// Example component to display cached images
export const ImageCache: React.FC<{ src: string; alt: string; cacheKey: string; className: string }> = ({ src, alt, cacheKey, className }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const cachedImage = await fetchImageWithCache(src, cacheKey);
                setImageSrc(cachedImage);
            } catch (error) {
                console.error('Error fetching image:', error);
                // If an error occurs, fall back to directly using the image URL
                setImageSrc(src);
            }
        };

        fetchImage();
    }, [src, cacheKey]);

    if (!imageSrc) {
        return <p>Loading image...</p>;
    }

    return <img src={imageSrc} alt={alt} className={className} />;
};

export default ImageCache;
