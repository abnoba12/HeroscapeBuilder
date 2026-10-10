/** Shared by the Privacy Policy and Terms of Service pages. */
export const LEGAL_LAST_UPDATED = 'October 9, 2026';

/**
 * Public contact address shown on the legal pages for privacy requests and takedown notices, as
 * [name, domain]. It is kept in pieces and only joined when a visitor clicks "Show contact email",
 * so scrapers reading the page or the bundle don't find a plain address.
 * Leave empty to hide the contact line.
 */
export const LEGAL_CONTACT_EMAIL_PARTS: [string, string] | null = ['abnoba12', 'gmail.com'];
