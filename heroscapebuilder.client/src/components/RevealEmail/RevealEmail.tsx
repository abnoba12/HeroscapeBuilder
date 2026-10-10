import React, { useState } from 'react';
import { LEGAL_CONTACT_EMAIL_PARTS } from '../../pages/legal/legal-config';

/**
 * Shows the contact email only after a click. The address is never in the rendered HTML until then,
 * which keeps simple scrapers from harvesting it while a person can still reveal it.
 */
const RevealEmail: React.FC = () => {
    const [revealed, setRevealed] = useState(false);

    if (!LEGAL_CONTACT_EMAIL_PARTS) return null;

    if (!revealed) {
        return (
            <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => setRevealed(true)}>
                Show contact email
            </button>
        );
    }

    const address = `${LEGAL_CONTACT_EMAIL_PARTS[0]}@${LEGAL_CONTACT_EMAIL_PARTS[1]}`;
    return <a href={`mailto:${address}`}>{address}</a>;
};

export default RevealEmail;
