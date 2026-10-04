using System.Text.RegularExpressions;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    /// <summary>
    /// Species names are copied from the printed cards, so one species shows up as "Elf" and "Elves". This gives
    /// every spelling the same key (lower case, last word singular) without changing the card data. The client has
    /// a matching <c>speciesKey</c> in <c>src/models/species.ts</c>; keep the two in sync, because the species page
    /// slugs come from it.
    /// </summary>
    public static class SpeciesHelper
    {
        // Names that end in "s" but are already singular.
        private static readonly HashSet<string> SingularEndingInS = new() { "cyclops" };

        private static readonly Regex EndsInSsUsIs = new("(ss|us|is)$", RegexOptions.Compiled);

        private static string Singularize(string word)
        {
            if (SingularEndingInS.Contains(word)) return word;
            if (word.EndsWith("ves")) return word[..^3] + "f"; // elves, dwarves, wolves
            if (word.EndsWith("ies") && word.Length > 4) return word[..^3] + "y";
            if (EndsInSsUsIs.IsMatch(word)) return word; // various, ...
            if (word.EndsWith('s')) return word[..^1];
            return word;
        }

        public static string Key(string? race)
        {
            var words = (race ?? string.Empty).Trim().ToLowerInvariant()
                .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
            if (words.Length == 0) return string.Empty;
            words[^1] = Singularize(words[^1]);
            return string.Join(' ', words);
        }
    }
}
