import React from 'react';
import { openCookieSettings } from '../../services/consent';
import RevealEmail from '../../components/RevealEmail/RevealEmail';
import { LEGAL_CONTACT_EMAIL_PARTS, LEGAL_LAST_UPDATED } from './legal-config';

const Privacy: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12" style={{ maxWidth: 900 }}>
                    <h1>Privacy Policy</h1>
                    <p><em>Last updated: {LEGAL_LAST_UPDATED}</em></p>

                    <p>
                        Heroscape Builder ("we", "us") is a free fan site for the Heroscape community. This policy explains
                        what information the site collects, why, and the choices you have. In short: we collect only what is
                        needed to run the site, we do not sell your information, and you can delete your account at any time.
                    </p>

                    <h2>Information we collect</h2>

                    <h3>If you create an account</h3>
                    <ul>
                        <li><strong>Email address and password.</strong> Your password is stored only as a salted hash; we cannot read it.</li>
                        <li>
                            <strong>Things you save</strong>: your unit collection, terrain you own, armies you build, and your
                            settings (such as your default point system).
                        </li>
                        <li>
                            <strong>Army votes</strong> you submit on the Power Ranking duels, linked to your account while you are signed in.
                        </li>
                    </ul>
                    <p>You do not need an account to browse the site, download cards, or use the calculators.</p>

                    <h3>If you do not have an account</h3>
                    <ul>
                        <li>
                            <strong>Power Ranking duel votes.</strong> A random identifier is stored in your browser so you are not shown
                            the same duel twice. It is not linked to your name or email unless you later sign in, in which case your
                            earlier votes may be attached to your account.
                        </li>
                    </ul>

                    <h3>Collected automatically</h3>
                    <ul>
                        <li>
                            <strong>Server logs.</strong> Like most websites, our server and hosting infrastructure may record your IP
                            address, browser type, and the pages you request, used for security, debugging, and keeping the site running.
                        </li>
                        <li>
                            <strong>Analytics (only if you accept).</strong> Google Analytics collects information about how visitors
                            use the site, such as pages viewed, approximate location, device, and browser.
                        </li>
                    </ul>

                    <h2>Cookies and local storage</h2>
                    <p>The site stores a small amount of data in your browser:</p>
                    <ul>
                        <li>
                            <strong>Essential:</strong> your sign-in tokens, your point system preference, your cookie choice, and the
                            anonymous duel identifier above. The site needs these to work; they are not used for advertising or tracking.
                        </li>
                        <li>
                            <strong>Optional (only if you click Accept):</strong> cookies from Google Analytics and from the Buy Me a
                            Coffee support widget. If you decline, these are never loaded.
                        </li>
                    </ul>
                    <p>
                        You can change your choice at any time:{' '}
                        <button type="button" className="btn btn-link p-0 align-baseline" onClick={openCookieSettings}>
                            Cookie settings
                        </button>.
                    </p>

                    <h2>How we use information</h2>
                    <ul>
                        <li>To provide your account and the features you use.</li>
                        <li>To keep the site secure and working, and to fix problems.</li>
                        <li>To understand which parts of the site are used so we can improve them (only with your consent).</li>
                    </ul>

                    <h2>Sharing</h2>
                    <p>We do not sell your personal information, and we do not use it for advertising. We share it only with:</p>
                    <ul>
                        <li>
                            <strong>Service providers</strong> that host and run the site (for example, our hosting and file-storage
                            providers), who process data on our behalf.
                        </li>
                        <li>
                            <strong>Google</strong>, if you accept analytics cookies (see Google's own privacy policy), and{' '}
                            <strong>Buy Me a Coffee</strong>, if you accept the support widget.
                        </li>
                        <li><strong>Anyone, if you share an army.</strong> A shared army link shows that army to anyone who has the link. It does not show your email address.</li>
                        <li><strong>Authorities</strong>, if we are legally required to.</li>
                    </ul>

                    <h2>Retention and deletion</h2>
                    <p>
                        We keep your account information for as long as your account exists. You can permanently delete your account,
                        along with your collection and armies, from your <a href="/user/profile">Profile</a> page. Basic server logs
                        are kept for a limited time and then removed.
                    </p>

                    <h2>Your rights</h2>
                    <p>
                        Depending on where you live (for example the EU/UK under GDPR, or California under the CCPA/CPRA), you may
                        have the right to access, correct, delete, or export your personal information, to object to or restrict
                        certain processing, and to withdraw consent at any time. You can delete your account yourself from your
                        Profile page.
                        {LEGAL_CONTACT_EMAIL_PARTS ? <> For anything else, contact us: <RevealEmail /></> : null}
                    </p>

                    <h2>Children</h2>
                    <p>
                        The site is not directed to children under 13, and we do not knowingly collect personal information from
                        them. If you believe a child has created an account, please let us know and we will delete it.
                    </p>

                    <h2>Security</h2>
                    <p>
                        We use reasonable measures to protect your information, including hashed passwords and encrypted
                        connections. No method of transmission or storage is perfectly secure, so we cannot guarantee absolute security.
                    </p>

                    <h2>International visitors</h2>
                    <p>
                        The site is operated from the United States, and your information may be processed there. By using the
                        site you understand your information may be transferred to and handled in the United States.
                    </p>

                    <h2>Changes to this policy</h2>
                    <p>
                        We may update this policy from time to time. The "Last updated" date at the top shows when it last changed.
                        Continued use of the site after a change means you accept the updated policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
