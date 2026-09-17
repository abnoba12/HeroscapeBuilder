export interface CreatorInfo {
    label: string;
    logo: string;
}

// Logos use the "_dark" variants (dark-colored artwork) since the badge sits on
// a light card-tile background; the plain variants are white artwork meant for
// dark backgrounds and are invisible here.
export const CREATORS: Record<string, CreatorInfo> = {
    HEROSCAPE: { label: 'Heroscape - Hasbro / Wizards of the Coast', logo: '/assets/img/logos/HEROSCAPE_dark.png' },
    RENEGADE: { label: 'Heroscape - Renegade', logo: '/assets/img/logos/RENEGADE_dark.png' },
    C3V: { label: 'C3V - Classic Custom Creators of Valhalla', logo: '/assets/img/logos/C3V_dark.png' },
    SOV: { label: 'SoV - Soldiers of Valhalla', logo: '/assets/img/logos/SOV_dark.png' },
    NGC: { label: 'NGC - New Generation Customs', logo: '/assets/img/logos/NGC_dark.png' },
    C3G: { label: 'C3G - Comic Custom Creators Guild', logo: '/assets/img/logos/C3G_dark.png' },
    // No usable logo asset exists for Custom yet (Custom.png is a blank 1x1 placeholder).
};

export function getCreatorInfo(creator?: string | null): CreatorInfo | undefined {
    if (!creator) return undefined;
    const key = Object.keys(CREATORS).find(k => k.toLowerCase() === creator.toLowerCase());
    return key ? CREATORS[key] : undefined;
}
