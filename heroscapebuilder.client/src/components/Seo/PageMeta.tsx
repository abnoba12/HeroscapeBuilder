import React, { useEffect } from "react";

const SITE_NAME = "Heroscape Builder";
const BASE_URL = "https://heroscapebuilder.com";
const DEFAULT_IMAGE = `${BASE_URL}/WKnight.png`;

interface PageMetaProps {
    title: string;
    description: string;
    /** Overrides the canonical path when this route duplicates another route's content. */
    canonicalPath?: string;
    /** Tells search engines not to index this page (private/admin/auth pages). */
    noindex?: boolean;
    /** Absolute URL of the image link previews should show. Defaults to the site logo. */
    image?: string;
    /** Adds a screen-reader/crawler-visible h1 for pages whose own content has no top-level heading. */
    heading?: string;
    children: React.ReactNode;
}

function setMetaTag(attr: "name" | "property", key: string, content: string): void {
    let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, canonicalPath, noindex, image, heading, children }) => {
    useEffect(() => {
        const fullTitle = `${title} | ${SITE_NAME}`;
        document.title = fullTitle;

        setMetaTag("name", "description", description);
        setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

        setMetaTag("property", "og:site_name", SITE_NAME);
        setMetaTag("property", "og:title", fullTitle);
        setMetaTag("property", "og:description", description);
        setMetaTag("property", "og:type", "website");
        setMetaTag("property", "og:image", image ?? DEFAULT_IMAGE);
        setMetaTag("name", "twitter:image", image ?? DEFAULT_IMAGE);
        setMetaTag("name", "twitter:card", image ? "summary_large_image" : "summary");
        setMetaTag("name", "twitter:title", fullTitle);
        setMetaTag("name", "twitter:description", description);

        const canonicalHref = `${BASE_URL}${canonicalPath ?? window.location.pathname}`;
        setMetaTag("property", "og:url", canonicalHref);

        let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonicalEl) {
            canonicalEl = document.createElement("link");
            canonicalEl.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalEl);
        }
        canonicalEl.setAttribute("href", canonicalHref);
    }, [title, description, canonicalPath, noindex, image]);

    return (
        <>
            {heading && <h1 className="visually-hidden">{heading}</h1>}
            {children}
        </>
    );
};

export default PageMeta;
