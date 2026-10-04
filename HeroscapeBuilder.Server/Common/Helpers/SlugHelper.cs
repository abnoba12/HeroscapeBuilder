using System.Globalization;
using System.Text;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    /// <summary>
    /// Builds URL slugs for unit, species, general and set pages. The client has a matching
    /// <c>slugify</c> in <c>src/services/catalog.ts</c>; keep the two in sync.
    /// </summary>
    public static class SlugHelper
    {
        public static string Slugify(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return string.Empty;

            var decomposed = value.Trim().ToLowerInvariant().Replace("&", " and ").Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();
            var lastWasDash = true;

            foreach (var c in decomposed)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) == UnicodeCategory.NonSpacingMark) continue;
                if (c == '\'' || c == '’') continue;

                if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))
                {
                    builder.Append(c);
                    lastWasDash = false;
                }
                else if (!lastWasDash)
                {
                    builder.Append('-');
                    lastWasDash = true;
                }
            }

            return builder.ToString().Trim('-');
        }

        /// <summary>
        /// Gives every unit a unique slug: the unit name, then name + creator when two units share a name,
        /// then name + creator + id as a last resort.
        /// </summary>
        public static void AssignUnitSlugs(IReadOnlyCollection<UnitEntity> units)
        {
            foreach (var group in units.GroupBy(unit => Slugify(unit.Name)))
            {
                var baseSlug = string.IsNullOrEmpty(group.Key) ? "unit" : group.Key;
                var members = group.OrderBy(unit => unit.Id).ToList();

                if (members.Count == 1)
                {
                    members[0].Slug = baseSlug;
                    continue;
                }

                foreach (var creatorGroup in members.GroupBy(unit => Slugify(unit.Creator)))
                {
                    var creatorSlug = $"{baseSlug}-{creatorGroup.Key}".TrimEnd('-');
                    var sameCreator = creatorGroup.ToList();

                    if (sameCreator.Count == 1)
                    {
                        sameCreator[0].Slug = creatorSlug;
                        continue;
                    }

                    // Same name and creator: tell them apart by set when that is unique, otherwise by id.
                    var setSlugs = sameCreator.Select(unit => Slugify(unit.Set?.Name)).ToList();
                    var setsAreUnique = setSlugs.All(slug => slug.Length > 0) && setSlugs.Distinct().Count() == setSlugs.Count;

                    for (var i = 0; i < sameCreator.Count; i++)
                    {
                        sameCreator[i].Slug = setsAreUnique ? $"{creatorSlug}-{setSlugs[i]}" : $"{creatorSlug}-{sameCreator[i].Id}";
                    }
                }
            }
        }
    }
}
