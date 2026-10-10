import React from 'react';
import RevealEmail from '../../components/RevealEmail/RevealEmail';
import { LEGAL_CONTACT_EMAIL_PARTS, LEGAL_LAST_UPDATED } from './legal-config';

const Terms: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12" style={{ maxWidth: 900 }}>
                    <h1>Terms of Service</h1>
                    <p><em>Last updated: {LEGAL_LAST_UPDATED}</em></p>

                    <p>
                        These terms govern your use of Heroscape Builder (the "site"). By using the site you agree to them. If you
                        do not agree, please do not use the site.
                    </p>

                    <h2>1. A fan project</h2>
                    <p>
                        Heroscape Builder is an unofficial, non-commercial fan site. It is not affiliated with, endorsed by, or
                        sponsored by Hasbro, Wizards of the Coast, Renegade Game Studios, or any other owner of Heroscape. Heroscape
                        and related names, card text, artwork, and game content are the property of their respective owners and are
                        referenced here for fan and educational purposes. Nothing on this site transfers any rights in that material.
                    </p>

                    <h2>2. Using the site</h2>
                    <p>
                        The site's tools (army card downloads and builders, unit data, maps, the game play calculator, and power
                        rankings) are provided free of charge for personal, non-commercial use. You agree not to:
                    </p>
                    <ul>
                        <li>use the site for anything unlawful, or to harm or harass others;</li>
                        <li>attempt to break, overload, probe, or gain unauthorized access to the site or other users' accounts;</li>
                        <li>scrape or copy the site in bulk, or use automated tools that place unreasonable load on it;</li>
                        <li>sell, or otherwise commercially exploit, material downloaded from the site.</li>
                    </ul>

                    <h2>3. Accounts</h2>
                    <p>
                        Some features require an account. You are responsible for keeping your password secure and for activity on
                        your account, and you agree to provide an accurate email address. You may delete your account at any time
                        from your Profile page. We may suspend or remove accounts that violate these terms or that we reasonably
                        believe are abused.
                    </p>

                    <h2>4. Your content</h2>
                    <p>
                        The collection, terrain, and army information you save is yours. You give us permission to store and
                        display it as needed to run the site for you, including showing an army to anyone who has the link if you
                        choose to share it. You are responsible for what you enter and should not include anything unlawful or
                        offensive.
                    </p>

                    <h2>5. Our content and accuracy</h2>
                    <p>
                        Unit data, points, rankings, and map information are compiled by fans and may contain errors or differ from
                        official sources. Rankings and calculators are for entertainment and planning, not authoritative rulings.
                        Cards you create or download are for your own personal use. Please do not sell them.
                    </p>

                    <h2>6. Intellectual property complaints</h2>
                    <p>
                        If you are a rights holder and believe material on the site infringes your rights, please contact us
                        {LEGAL_CONTACT_EMAIL_PARTS ? <> (<RevealEmail />)</> : null}
                        {' '}with enough detail to identify the material, and we will review it promptly and remove it where appropriate.
                    </p>

                    <h2>7. Third-party links and services</h2>
                    <p>
                        The site links to and uses third-party services (such as print shops, Google Analytics, and Buy Me a
                        Coffee). We do not control them and are not responsible for their content or practices.
                    </p>

                    <h2>8. No warranty</h2>
                    <p>
                        The site is provided "as is" and "as available", without warranties of any kind, express or implied,
                        including accuracy, availability, fitness for a particular purpose, and non-infringement. We do not
                        guarantee the site will be uninterrupted or error-free, and we may change, suspend, or discontinue any part
                        of it at any time.
                    </p>

                    <h2>9. Limitation of liability</h2>
                    <p>
                        To the fullest extent permitted by law, we are not liable for any indirect, incidental, special,
                        consequential, or punitive damages, or for any loss of data, profits, or goodwill, arising from your use of
                        (or inability to use) the site. Because the site is free, our total liability for any claim is limited to
                        fifty U.S. dollars ($50).
                    </p>

                    <h2>10. Changes and termination</h2>
                    <p>
                        We may update these terms from time to time. The "Last updated" date shows the latest version, and continued
                        use of the site means you accept the changes. We may suspend or end your access at any time for any
                        reason, including violation of these terms.
                    </p>

                    <h2>11. Governing law</h2>
                    <p>
                        These terms are governed by the laws of the United States and the state in which the site operator resides,
                        without regard to conflict-of-law rules.
                    </p>

                    <h2>12. Privacy</h2>
                    <p>
                        Our <a href="/privacy">Privacy Policy</a> explains how we handle your information and is part of these terms.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
