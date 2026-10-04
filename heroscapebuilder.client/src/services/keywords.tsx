import React from 'react';
import { Link } from 'react-router-dom';
import { speciesKey } from '../models/species';
import { Unit } from '../models/unit';

/**
 * Rules keywords found in ability text (personalities, size categories, species, unit types, rarities).
 * Each one links to the Unit Data grid filtered on the matching column, using the same `filters` URL
 * param the grid writes itself.
 */

interface KeywordColumn {
    column: keyof Unit & string;
    /** Values seen on fewer units than this are skipped; they are mostly typos and one-offs. */
    minUnits: number;
    /** Also match these suffixes ("Humans" -> Human, "Heroes" -> Hero). */
    plural?: string[];
    /** Match any capitalization; for words that are only ever used as the rules term ("small or medium figure"). */
    anyCase?: boolean;
    /** Only a keyword when the text goes on to say "personality" ("a Tricky personality"); "Wild Swing" is not one. */
    beforePersonality?: boolean;
}

const KEYWORD_COLUMNS: KeywordColumn[] = [
    { column: 'personality', minUnits: 2, beforePersonality: true },
    { column: 'sizeCategory', minUnits: 2, anyCase: true },
    { column: 'race', minUnits: 1, plural: ['s'] }, // one-unit species (Wulsinu) are still real species
    { column: 'general', minUnits: 3 },
    { column: 'type', minUnits: 2, plural: ['s', 'es'] },
    { column: 'rarity', minUnits: 2 },
];

// Species names that are also ordinary rules words; linking them would be noise.
const STOP_WORDS = new Set(['Unaffiliated', 'Shadow', 'Various', 'Varied', 'Hybrid', 'Eternal', 'Mutant', 'Clone', 'Omen', 'Outsider', 'Boar', 'Worm', 'Xeno', 'Symbiote']);

export interface KeywordIndex {
    pattern: RegExp;
    lookup: Map<string, { column: string; value: string }>;
    /** Matches what must follow a personality word for it to count: more personalities, then "personality". */
    personalityTail: RegExp;
    /** Matches a role right after a species or general ("Orc Archers"); roles never link on their own. */
    roleTail: RegExp;
}

export interface FilterCondition {
    column: string;
    value: string;
    /** What to show instead of `value` when they differ (species filter on a normalized key). */
    label?: string;
    type?: 'equals' | 'contains';
}

/** Columns whose keyword can be followed by a role to make a combined filter. */
const ROLE_PARTNERS = new Set(['race', 'general']);

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildKeywordIndex = (units: Unit[]): KeywordIndex => {
    const lookup = new Map<string, { column: string; value: string }>();
    const anyCaseWords = new Set<string>();
    const personalityWords: string[] = [];

    for (const { column, minUnits, plural, anyCase, beforePersonality } of KEYWORD_COLUMNS) {
        const counts = new Map<string, number>();
        for (const unit of units) {
            const value = (unit[column] as string | undefined)?.trim();
            if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        for (const [value, count] of counts) {
            if (count < minUnits || STOP_WORDS.has(value) || lookup.has(value)) continue;
            const key = anyCase ? value.toLowerCase() : value;
            // Species filter on the singular key so "Goblin" also finds the cards printed "Goblins" (the grid
            // column compares the same key).
            const entry = column === 'race' ? { column, value: speciesKey(value), label: value } : { column, value };
            lookup.set(key, entry);
            if (anyCase) anyCaseWords.add(key);
            if (beforePersonality) personalityWords.push(value);
            for (const suffix of plural ?? []) {
                if (!counts.has(`${value}${suffix}`)) lookup.set(`${value}${suffix}`, entry);
            }
        }
    }

    // Longest first so "Half-Elf" wins over "Elf". Matching is case-sensitive except for the size words:
    // the printed cards capitalize most keywords, and lowercase "common" is just English.
    const toPattern = (key: string) => anyCaseWords.has(key)
        ? [...key].map(ch => `[${ch}${ch.toUpperCase()}]`).join('')
        : escapeRegex(key);
    const words = [...lookup.keys()].sort((a, b) => b.length - a.length).map(toPattern);

    const personalities = personalityWords.map(escapeRegex).join('|');
    const personalityTail = new RegExp(`^(?:(?:\\s*,\\s*(?:or\\s+)?|\\s+(?:or|and)\\s+)(?:${personalities}))*\\s+personalit(?:y|ies)\\b`, 'i');

    // Roles are too ordinary to link alone (Guard, Soldier, Champion), so they only count directly after a
    // species or general. A role can list several ("Scientist, Wizard"), and plurals fold into the singular.
    const roleCounts = new Map<string, number>();
    for (const unit of units) {
        for (const role of (unit.role ?? '').split(',').map(r => r.trim()).filter(Boolean)) {
            roleCounts.set(role, (roleCounts.get(role) ?? 0) + 1);
        }
    }
    const roles = [...roleCounts]
        .filter(([role, count]) => count >= 2 && !(role.endsWith('s') && roleCounts.has(role.slice(0, -1))))
        .map(([role]) => escapeRegex(role))
        .sort((a, b) => b.length - a.length);
    const roleTail = new RegExp(`^\\s+(${roles.join('|')})s?\\b`);

    return { pattern: new RegExp(`\\b(${words.join('|')})\\b`, 'g'), lookup, personalityTail, roleTail };
};

export const unitDataFilterPath = (conditions: FilterCondition[]) => {
    const filters = JSON.stringify(Object.fromEntries(
        conditions.map(({ column, value, type = 'equals' }) => [column, { filterType: 'text', type, filter: value }]),
    ));
    return `/data/unit-data?filters=${encodeURIComponent(filters)}`;
};

/**
 * Reads the keywords that start at `start`. Keywords from different columns sitting next to each other
 * ("Common Medium Eisenek Heroes") form one chain, and a species or general can take a role ("Orc Archers").
 * Returns null when there is no keyword at `start`.
 */
const readKeywordChain = (
    text: string,
    start: number,
    index: KeywordIndex,
    nameSpans: Array<[number, number]>,
): { conditions: FilterCondition[]; end: number } | null => {
    const sticky = new RegExp(index.pattern.source, 'y');
    const conditions: FilterCondition[] = [];
    let at = start;
    let end = start;

    for (;;) {
        sticky.lastIndex = at;
        const match = sticky.exec(text);
        const keyword = match && (index.lookup.get(match[0]) ?? index.lookup.get(match[0].toLowerCase()));
        if (!match || !keyword || conditions.some(c => c.column === keyword.column)) break;
        if (nameSpans.some(([from, to]) => at < to && at + match[0].length > from)) break;
        if (keyword.column === 'personality' && !index.personalityTail.test(text.slice(at + match[0].length))) break;

        conditions.push(keyword);
        end = at + match[0].length;

        const role = ROLE_PARTNERS.has(keyword.column) && !conditions.some(c => c.column === 'role')
            ? index.roleTail.exec(text.slice(end))
            : null;
        if (role) {
            // "contains" so the singular also finds plural and multi-role cards ("Archers", "Sniper, Archer").
            conditions.push({ column: 'role', value: role[1], type: 'contains' });
            end += role[0].length;
        }

        const gap = /^[ \t]+/.exec(text.slice(end));
        if (!gap) break;
        at = end + gap[0].length;
    }

    return conditions.length ? { conditions, end } : null;
};

/**
 * Where the unit's own name (or its singular/plural form) appears in the text. "Marro Warriors" is a species
 * and a role, but in the Marro Warriors' own abilities it means the unit, so those words must not link.
 */
const findNameSpans = (text: string, unitName?: string): Array<[number, number]> => {
    const words = (unitName ?? '').split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    // Each word may appear singular or plural, including irregular plurals ("Wolves" in the name, "Wolf" in the text).
    const forms = (word: string) => {
        const singular = speciesKey(word);
        const variants = new Set([word.toLowerCase(), singular, `${singular}s`, `${singular}es`]);
        if (singular.endsWith('f')) variants.add(`${singular.slice(0, -1)}ves`);
        return [...variants].filter(Boolean).sort((a, b) => b.length - a.length).map(escapeRegex).join('|');
    };
    const pattern = words.map(word => `(?:${forms(word)})`).join('\\s+');
    return [...text.matchAll(new RegExp(`\\b${pattern}\\b`, 'gi'))].map(m => [m.index ?? 0, (m.index ?? 0) + m[0].length]);
};

/** Renders text with each known keyword turned into a link to the filtered Unit Data page. */
export const KeywordText: React.FC<{ text: string; index: KeywordIndex; unitName?: string; onNavigate?: () => void }> = ({ text, index, unitName, onNavigate }) => {
    const parts: React.ReactNode[] = [];
    const finder = new RegExp(index.pattern.source, 'g');
    const nameSpans = findNameSpans(text, unitName);
    let last = 0;

    for (let match = finder.exec(text); match; match = finder.exec(text)) {
        const chain = readKeywordChain(text, match.index, index, nameSpans);
        if (!chain) continue;

        if (match.index > last) parts.push(text.slice(last, match.index));
        parts.push(
            <Link
                key={match.index}
                className="keyword-link"
                to={unitDataFilterPath(chain.conditions)}
                onClick={onNavigate}
                title={`See every unit with ${chain.conditions.map(c => `${c.column === 'sizeCategory' ? 'size' : c.column}: ${c.label ?? c.value}`).join(', ')}`}
            >
                {text.slice(match.index, chain.end)}
            </Link>,
        );
        last = chain.end;
        finder.lastIndex = chain.end;
    }
    if (last < text.length) parts.push(text.slice(last));

    return <>{parts}</>;
};
