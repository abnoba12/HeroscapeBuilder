import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Utility function to convert Blob to Base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Function to cache and retrieve images
const fetchImageWithCache = async (url: string, cacheKey: string, cacheDuration = 86400): Promise<string> => {
    const now = new Date().getTime();
    const cachedImage = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}_time`);

    // If cached data exists and is not expired, return it
    if (cachedImage && cachedTime && now - parseInt(cachedTime) < cacheDuration * 1000) {
        return cachedImage; // Return cached Base64 string
    }

    // Fetch the image from the API
    const response = await api.get(url, { responseType: 'blob' });

    // Convert the image blob to Base64
    const base64Image = await blobToBase64(response.data);

    // Attempt to cache the result
    try {
        localStorage.setItem(cacheKey, base64Image);
        localStorage.setItem(`${cacheKey}_time`, now.toString());
    } catch (error) {
        // Catch QuotaExceededError and fallback to just returning the image
        if (error.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded, skipping caching.');
        } else {
            throw error;
        }
    }

    return base64Image;
};

// Example component to display cached images
const ImageCache: React.FC<{ src: string; alt: string; cacheKey: string; className: string }> = ({ src, alt, cacheKey, className }) => {
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
