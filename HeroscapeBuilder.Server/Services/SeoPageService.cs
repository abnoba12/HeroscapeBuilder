using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Common.Seo;
using HeroscapeBuilder.Server.Domain.Entities;
using Microsoft.Extensions.Caching.Memory;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Builds the sitemap and the crawler-friendly HTML (title, description, Open Graph, JSON-LD and a plain
    /// text body) for the data-driven unit / species / general / set pages. The React app takes over in the
    /// browser; this exists so search engines and link previews, which don't run JavaScript, see real content.
    /// </summary>
    public class SeoPageService
    {
        public const string SiteName = "Heroscape Builder";
        public const string BaseUrl = "https://heroscapebuilder.com";
        private const string DefaultImage = BaseUrl + "/WKnight.png";
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

        private static readonly string[] StaticPaths =
        {
            "/", "/army-cards", "/army-cards/standard", "/army-cards/standard/download", "/army-cards/standard/create",
            "/army-cards/threebyfive", "/army-cards/threebyfive/download", "/army-cards/threebyfive/create",
            "/army-cards/playingcard", "/army-cards/playingcard/download", "/army-cards/playingcard/create",
            "/army-cards/printing", "/data/unit-data", "/game-play/game-play-calc",
            "/species", "/generals", "/sets",
        };

        private readonly UnitService _unitService;
        private readonly IMemoryCache _cache;

        public SeoPageService(UnitService unitService, IMemoryCache cache)
        {
            _unitService = unitService;
            _cache = cache;
        }

        public async Task<SeoCatalog> GetCatalog()
        {
            if (_cache.TryGetValue("seo-catalog", out SeoCatalog? cached) && cached != null) return cached;

            var units = (await _unitService.GetAllUnits())
                .OrderBy(unit => unit.Name, StringComparer.OrdinalIgnoreCase)
                .ToList();

            var catalog = new SeoCatalog
            {
                Units = units,
                Species = GroupUnits(units, unit => unit.Race, SpeciesHelper.Key),
                Generals = GroupUnits(units, unit => unit.General),
                Sets = GroupUnits(units, unit => unit.Set?.Name),
            };

            _cache.Set("seo-catalog", catalog, CacheDuration);
            return catalog;
        }

        private static Dictionary<string, SeoGroup> GroupUnits(List<UnitEntity> units, Func<UnitEntity, string?> key, Func<string, string>? normalize = null)
        {
            normalize ??= value => value;

            return units
                .Where(unit => !string.IsNullOrWhiteSpace(key(unit)))
                .GroupBy(unit => SlugHelper.Slugify(normalize(key(unit)!)))
                .Where(group => group.Key.Length > 0)
                .ToDictionary(
                    group => group.Key,
                    group => new SeoGroup(
                        group.Key,
                        // Show the spelling already in its normal (singular) form if there is one, else the most common.
                        group.GroupBy(unit => key(unit)!)
                            .OrderByDescending(names => normalize(names.Key) == names.Key.ToLowerInvariant())
                            .ThenByDescending(names => names.Count())
                            .First().Key,
                        group.ToList()));
        }

        // ---------- Sitemap ----------

        public async Task<string> BuildSitemap()
        {
            var catalog = await GetCatalog();
            var paths = new List<(string Path, string Priority)>();

            paths.AddRange(StaticPaths.Select(path => (path, path == "/" ? "1.0" : "0.7")));
            paths.AddRange(catalog.Species.Keys.OrderBy(k => k).Select(slug => ($"/species/{slug}", "0.6")));
            paths.AddRange(catalog.Generals.Keys.OrderBy(k => k).Select(slug => ($"/generals/{slug}", "0.6")));
            paths.AddRange(catalog.Sets.Keys.OrderBy(k => k).Select(slug => ($"/sets/{slug}", "0.6")));
            paths.AddRange(catalog.Units.Select(unit => ($"/units/{unit.Slug}", "0.8")));

            var xml = new StringBuilder();
            xml.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
            xml.AppendLine("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
            foreach (var (path, priority) in paths)
            {
                xml.AppendLine($"  <url><loc>{H(BaseUrl + path)}</loc><changefreq>monthly</changefreq><priority>{priority}</priority></url>");
            }
            xml.AppendLine("</urlset>");
            return xml.ToString();
        }

        // ---------- Page content ----------

        public async Task<SeoPageContent?> GetPage(string kind, string? slug)
        {
            var catalog = await GetCatalog();

            if (string.IsNullOrEmpty(slug))
            {
                return kind switch
                {
                    "species" => GroupIndexPage("species", "Heroscape Species", "Every Heroscape species and the units that belong to them.", catalog.Species),
                    "generals" => GroupIndexPage("generals", "Heroscape Generals", "Every Heroscape general and the units that serve them.", catalog.Generals),
                    "sets" => GroupIndexPage("sets", "Heroscape Sets", "Every Heroscape set and the units that come in each box.", catalog.Sets),
                    _ => null,
                };
            }

            return kind switch
            {
                "units" => catalog.Units.FirstOrDefault(unit => unit.Slug == slug) is { } unit ? UnitPage(unit) : null,
                // Old species links used the printed spelling ("goblins"); fold those onto the singular page.
                "species" => catalog.Species.TryGetValue(slug, out var species)
                    || catalog.Species.TryGetValue(SlugHelper.Slugify(SpeciesHelper.Key(slug.Replace('-', ' '))), out species)
                        ? GroupPage("species", species)
                        : null,
                "generals" => catalog.Generals.TryGetValue(slug, out var general) ? GroupPage("generals", general) : null,
                "sets" => catalog.Sets.TryGetValue(slug, out var set) ? GroupPage("sets", set) : null,
                _ => null,
            };
        }

        public static int? PointsFor(UnitEntity unit) => unit.RenegadePoints ?? unit.StandardPoints;

        private static string? CardImage(UnitEntity unit)
        {
            foreach (var purpose in new[] { "Standard_Army_Card", "3x5_Army_Card", "PC_Army_Card" })
            {
                var thumb = unit.Files.Where(f => f.FilePurpose == purpose).Select(f => f.Thumb).FirstOrDefault(t => !string.IsNullOrEmpty(t));
                if (!string.IsNullOrEmpty(thumb)) return thumb;
            }

            return unit.Files.FirstOrDefault(f => f.FilePurpose == "Card_Hitbox_Image")?.FilePath;
        }

        public static string UnitDescription(UnitEntity unit)
        {
            var parts = new List<string>();
            var identity = string.Join(" ", new[] { unit.Race, unit.Role }.Where(v => !string.IsNullOrWhiteSpace(v)));
            parts.Add(string.IsNullOrEmpty(identity) ? $"{unit.Name} Heroscape unit." : $"{unit.Name} is a {identity} Heroscape unit.");

            var stats = new List<string>();
            if (unit.Life != null) stats.Add($"Life {unit.Life}");
            if (unit.AdvMove != null) stats.Add($"Move {unit.AdvMove}");
            if (unit.AdvRange != null) stats.Add($"Range {unit.AdvRange}");
            if (unit.AdvAttack != null) stats.Add($"Attack {unit.AdvAttack}");
            if (unit.AdvDefense != null) stats.Add($"Defense {unit.AdvDefense}");
            if (PointsFor(unit) is { } points) stats.Add($"{points} points");
            if (stats.Count > 0) parts.Add(string.Join(", ", stats) + ".");

            if (unit.Set != null) parts.Add($"Comes in {unit.Set.Name}.");
            parts.Add("Full abilities and free printable army cards.");

            var text = string.Join(" ", parts);
            return text.Length <= 300 ? text : text[..297] + "...";
        }

        private static SeoPageContent UnitPage(UnitEntity unit)
        {
            var name = unit.Name ?? "Heroscape Unit";
            var title = $"{name} - Heroscape Unit Stats & Army Cards";
            var description = UnitDescription(unit);
            var image = CardImage(unit) ?? DefaultImage;

            var body = new StringBuilder();
            body.Append($"<h1>{H(name)}</h1><p>{H(description)}</p><ul>");
            void Row(string label, object? value)
            {
                var text = value?.ToString();
                if (!string.IsNullOrWhiteSpace(text)) body.Append($"<li>{H(label)}: {H(text)}</li>");
            }
            Row("Species", unit.Race);
            Row("General", unit.General);
            Row("Role", unit.Role);
            Row("Type", unit.Type);
            Row("Rarity", unit.Rarity);
            Row("Size", unit.SizeCategory);
            Row("Height", unit.Size);
            Row("Life", unit.Life);
            Row("Move", unit.AdvMove);
            Row("Range", unit.AdvRange);
            Row("Attack", unit.AdvAttack);
            Row("Defense", unit.AdvDefense);
            Row("Standard points", unit.StandardPoints);
            Row("Renegade points", unit.RenegadePoints ?? unit.StandardPoints);
            Row("Delta points", unit.DeltaPoints ?? unit.StandardPoints);
            Row("Set", unit.Set?.Name);
            Row("Planet", unit.Planet);
            Row("Creator", unit.Creator);
            body.Append("</ul>");

            if (unit.Abilities.Count > 0)
            {
                body.Append("<h2>Abilities</h2>");
                foreach (var ability in unit.Abilities)
                {
                    body.Append($"<h3>{H(ability.AbilityName)}</h3><p>{H(ability.Ability)}</p>");
                }
            }

            var related = new List<string>();
            if (!string.IsNullOrWhiteSpace(unit.Race)) related.Add($"<a href=\"/species/{SlugHelper.Slugify(SpeciesHelper.Key(unit.Race))}\">{H(unit.Race)} units</a>");
            if (!string.IsNullOrWhiteSpace(unit.General)) related.Add($"<a href=\"/generals/{SlugHelper.Slugify(unit.General)}\">{H(unit.General)} units</a>");
            if (unit.Set != null) related.Add($"<a href=\"/sets/{SlugHelper.Slugify(unit.Set.Name)}\">{H(unit.Set.Name)}</a>");
            if (related.Count > 0) body.Append($"<p>{string.Join(" | ", related)}</p>");

            var jsonLd = new Dictionary<string, object?>
            {
                ["@context"] = "https://schema.org",
                ["@type"] = "WebPage",
                ["name"] = title,
                ["description"] = description,
                ["url"] = $"{BaseUrl}/units/{unit.Slug}",
                ["image"] = image,
                ["isPartOf"] = new Dictionary<string, object?> { ["@type"] = "WebSite", ["name"] = SiteName, ["url"] = BaseUrl },
                ["breadcrumb"] = Breadcrumbs(("Unit Data", "/data/unit-data"), (name, $"/units/{unit.Slug}")),
            };

            return new SeoPageContent(title, description, $"/units/{unit.Slug}", image, body.ToString(), jsonLd);
        }

        private static SeoPageContent GroupPage(string kind, SeoGroup group)
        {
            var noun = kind == "species" ? "species" : kind == "generals" ? "general" : "set";
            var title = kind switch
            {
                "species" => $"{group.Name} Heroscape Units - All {group.Name} Stats & Cards",
                "generals" => $"{group.Name} Heroscape Units - Army Stats & Cards",
                _ => $"{group.Name} - Heroscape Set Contents, Units & Cards",
            };
            var names = string.Join(", ", group.Units.Select(u => u.Name).Take(8));
            var description = $"All {group.Units.Count} Heroscape units for the {group.Name} {noun}, including {names}. Stats, abilities and free printable army cards.";
            if (description.Length > 300) description = description[..297] + "...";

            var body = new StringBuilder($"<h1>{H(title)}</h1><p>{H(description)}</p><ul>");
            foreach (var unit in group.Units)
            {
                body.Append($"<li><a href=\"/units/{unit.Slug}\">{H(unit.Name)}</a></li>");
            }
            body.Append("</ul>");

            var path = $"/{kind}/{group.Slug}";
            var image = group.Units.Select(CardImage).FirstOrDefault(i => i != null) ?? DefaultImage;
            var indexName = kind == "species" ? "Species" : kind == "generals" ? "Generals" : "Sets";
            var jsonLd = new Dictionary<string, object?>
            {
                ["@context"] = "https://schema.org",
                ["@type"] = "CollectionPage",
                ["name"] = title,
                ["description"] = description,
                ["url"] = BaseUrl + path,
                ["breadcrumb"] = Breadcrumbs((indexName, $"/{kind}"), (group.Name, path)),
            };

            return new SeoPageContent(title, description, path, image, body.ToString(), jsonLd);
        }

        private static SeoPageContent GroupIndexPage(string kind, string title, string description, Dictionary<string, SeoGroup> groups)
        {
            var body = new StringBuilder($"<h1>{H(title)}</h1><p>{H(description)}</p><ul>");
            var ordered = kind == "species"
                ? groups.Values.OrderByDescending(g => g.Units.Count).ThenBy(g => g.Name, StringComparer.OrdinalIgnoreCase)
                : groups.Values.OrderBy(g => g.Name, StringComparer.OrdinalIgnoreCase);
            foreach (var group in ordered)
            {
                body.Append($"<li><a href=\"/{kind}/{group.Slug}\">{H(group.Name)}</a> ({group.Units.Count})</li>");
            }
            body.Append("</ul>");

            return new SeoPageContent(title, description, $"/{kind}", DefaultImage, body.ToString(), null);
        }

        private static object Breadcrumbs(params (string Name, string Path)[] crumbs)
        {
            return new Dictionary<string, object?>
            {
                ["@type"] = "BreadcrumbList",
                ["itemListElement"] = crumbs.Select((crumb, index) => new Dictionary<string, object?>
                {
                    ["@type"] = "ListItem",
                    ["position"] = index + 1,
                    ["name"] = crumb.Name,
                    ["item"] = BaseUrl + crumb.Path,
                }).ToList(),
            };
        }

        // ---------- HTML shell ----------

        /// <summary>
        /// Rewrites the built index.html with the page's head tags and a plain-HTML body inside #root
        /// (React replaces it as soon as the app loads).
        /// </summary>
        public static string RenderShell(string template, SeoPageContent page)
        {
            var fullTitle = $"{page.Title} | {SiteName}";
            var url = BaseUrl + page.CanonicalPath;

            var head = new StringBuilder();
            head.Append($"<title>{H(fullTitle)}</title>");
            head.Append($"<meta name=\"description\" content=\"{H(page.Description)}\" />");
            head.Append("<meta name=\"robots\" content=\"index, follow\" />");
            head.Append($"<link rel=\"canonical\" href=\"{H(url)}\" />");
            head.Append($"<meta property=\"og:site_name\" content=\"{SiteName}\" />");
            head.Append("<meta property=\"og:type\" content=\"website\" />");
            head.Append($"<meta property=\"og:title\" content=\"{H(fullTitle)}\" />");
            head.Append($"<meta property=\"og:description\" content=\"{H(page.Description)}\" />");
            head.Append($"<meta property=\"og:url\" content=\"{H(url)}\" />");
            head.Append($"<meta property=\"og:image\" content=\"{H(page.Image)}\" />");
            head.Append("<meta name=\"twitter:card\" content=\"summary_large_image\" />");
            head.Append($"<meta name=\"twitter:title\" content=\"{H(fullTitle)}\" />");
            head.Append($"<meta name=\"twitter:description\" content=\"{H(page.Description)}\" />");
            head.Append($"<meta name=\"twitter:image\" content=\"{H(page.Image)}\" />");
            if (page.JsonLd != null)
            {
                var json = JsonSerializer.Serialize(page.JsonLd).Replace("<", "\\u003c");
                head.Append($"<script type=\"application/ld+json\">{json}</script>");
            }

            // Drop the template's generic tags that this page replaces.
            var html = Regex.Replace(
                template,
                "<title>.*?</title>|<meta name=\"description\"[^>]*>|<meta property=\"og:(title|description|image)\"[^>]*>|<meta name=\"twitter:card\"[^>]*>|<link rel=\"canonical\"[^>]*>",
                string.Empty,
                RegexOptions.Singleline);

            html = html.Replace("</head>", head + "</head>");
            html = html.Replace("<div id=\"root\"></div>", $"<div id=\"root\">{page.BodyHtml}</div>");
            return html;
        }

        private static string H(string? value) => WebUtility.HtmlEncode(value ?? string.Empty);
    }
}
