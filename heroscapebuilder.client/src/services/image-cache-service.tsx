import React, { useState } from 'react';

const NOT_FOUND_IMAGE = "/assets/img/imageNotFound.png";

// Plain lazy-loaded <img>: the browser's HTTP cache handles caching, decoding and eviction.
// `cacheKey` is accepted for backwards compatibility but no longer used.
export const ImageCache: React.FC<{ src?: string; alt: string; cacheKey?: string; className: string }> = ({ src, alt, className }) => {
    const [failedSrc, setFailedSrc] = useState<string | undefined>();

    if (!src) {
        console.error(`Image path not set: ${src}`);
    }

    return (
        <img
            src={!src || failedSrc === src ? NOT_FOUND_IMAGE : src}
            alt={alt}
            className={className}
            loading="lazy"
            decoding="async"
            onError={() => setFailedSrc(src)}
        />
    );
};

export default ImageCache;
