/**
 * Cookie/analytics consent. Google Analytics and the Buy Me a Coffee widget are only loaded after the visitor
 * accepts; the choice is remembered in localStorage and can be changed from the footer.
 */
export type ConsentChoice = 'granted' | 'denied';

const CONSENT_KEY = 'cookieConsent';
const GA_ID = 'G-0901T32E95';
const BMC_SRC = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';

export const CONSENT_CHANGED_EVENT = 'consent-changed';
export const OPEN_COOKIE_SETTINGS_EVENT = 'open-cookie-settings';

let optionalScriptsLoaded = false;

export const getConsent = (): ConsentChoice | null => {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        return value === 'granted' || value === 'denied' ? value : null;
    } catch {
        return null;
    }
};

const loadGoogleAnalytics = () => {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', GA_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);
};

const loadBuyMeACoffee = () => {
    const script = document.createElement('script');
    script.src = BMC_SRC;
    script.async = true;
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'Abnoba12');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#5F7FFF');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    // The widget initialises on DOMContentLoaded, which has already fired by the time consent is given.
    script.onload = () => {
        const event = document.createEvent('Event');
        event.initEvent('DOMContentLoaded', true, true);
        window.document.dispatchEvent(event);
    };
    document.body.appendChild(script);
};

/** Loads the optional third-party scripts once, and only if the visitor has accepted. */
export const loadOptionalScriptsIfConsented = () => {
    if (optionalScriptsLoaded || getConsent() !== 'granted') return;
    optionalScriptsLoaded = true;
    loadGoogleAnalytics();
    loadBuyMeACoffee();
};

export const setConsent = (choice: ConsentChoice) => {
    const previous = getConsent();
    try {
        localStorage.setItem(CONSENT_KEY, choice);
    } catch {
        // Storage blocked: the choice only lasts for this page view.
    }

    if (choice === 'granted') {
        loadOptionalScriptsIfConsented();
    } else if (optionalScriptsLoaded || previous === 'granted') {
        // Scripts that are already running can't be unloaded; a reload starts the page without them.
        window.location.reload();
        return;
    }

    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
};

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
