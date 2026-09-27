/**
 * Species names are copied from the printed cards, so the same species shows up as "Elf" and
 * "Elves", or "KYRIE" and "Kyrie". These helpers group them without changing the card data.
 */

// Names that end in "s" but are already singular.
const SINGULAR_ENDING_IN_S = new Set(['cyclops']);

const singularize = (word: string): string => {
    if (SINGULAR_ENDING_IN_S.has(word)) return word;
    if (word.endsWith('ves')) return `${word.slice(0, -3)}f`; // elves, dwarves, wolves
    if (word.endsWith('ies') && word.length > 4) return `${word.slice(0, -3)}y`;
    if (/(ss|us|is)$/.test(word)) return word; // various, ...
    if (word.endsWith('s')) return word.slice(0, -1);
    return word;
};

/** A key that is the same for every spelling of a species: lower case, trimmed, last word made singular. */
export const speciesKey = (race?: string | null): string => {
    const words = (race ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return '';
    words[words.length - 1] = singularize(words[words.length - 1]);
    return words.join(' ');
};

/** Display name for a species key: each word (and each hyphenated part) capitalized, e.g. "Half-Elf". */
export const speciesLabel = (key: string): string =>
    key.replace(/(^|[\s-])(\p{L})/gu, (_, separator: string, letter: string) => separator + letter.toUpperCase());
