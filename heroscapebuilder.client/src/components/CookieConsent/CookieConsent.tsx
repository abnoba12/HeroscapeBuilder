import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    getConsent,
    loadOptionalScriptsIfConsented,
    OPEN_COOKIE_SETTINGS_EVENT,
    setConsent,
} from '../../services/consent';

const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(() => getConsent() === null);

    useEffect(() => {
        // Returning visitors who already accepted get the optional scripts straight away.
        loadOptionalScriptsIfConsented();

        const open = () => setVisible(true);
        window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
        return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    }, []);

    if (!visible) return null;

    const choose = (choice: 'granted' | 'denied') => {
        setVisible(false);
        setConsent(choice);
    };

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                background: '#212120',
                color: '#fff',
                padding: '14px 18px',
                boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: '0 auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <p style={{ margin: 0, flex: '1 1 420px', fontSize: 14 }}>
                    We use optional cookies from Google Analytics (to see how the site is used) and Buy Me a Coffee
                    (the support button). They only load if you accept. The site works the same either way. See our{' '}
                    <Link to="/privacy" style={{ color: '#9ec5ff', textDecoration: 'underline' }}>Privacy Policy</Link>.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => choose('denied')}>
                        Decline
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => choose('granted')}>
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
