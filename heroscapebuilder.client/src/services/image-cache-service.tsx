import React, { useEffect, useState } from 'react';
import { base64Cache } from './cache-manager';
import brokenImage from "../../src/assets/img/imageNotFound.png";

// Example component to display cached images
export const ImageCache: React.FC<{ src?: string; alt: string; cacheKey?: string; className: string }> = ({ src, alt, cacheKey, className }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        // If src or cacheKey is not provided, return the broken image
        if (!src || !cacheKey) {
            console.error(`Image path not set: ${src} - ${cacheKey}`);
            setImageSrc(brokenImage);
            return;
        }

        const fetchImage = async () => {
            try {
                const cachedImage = await base64Cache(src, cacheKey);
                setImageSrc(cachedImage);
            } catch (error) {
                console.error(`Error fetching image: ${src}`, error);
                // If an error occurs, fall back to the broken image
                setImageSrc(brokenImage);
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
