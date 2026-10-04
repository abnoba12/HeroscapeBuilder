using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Common.Seo
{
    // Kept outside the Services namespace: every class in that namespace is auto-registered for DI.
    public sealed record SeoGroup(string Slug, string Name, List<UnitEntity> Units);

    public sealed class SeoCatalog
    {
        public List<UnitEntity> Units { get; init; } = new();
        public Dictionary<string, SeoGroup> Species { get; init; } = new();
        public Dictionary<string, SeoGroup> Generals { get; init; } = new();
        public Dictionary<string, SeoGroup> Sets { get; init; } = new();
    }

    public sealed record SeoPageContent(string Title, string Description, string CanonicalPath, string Image, string BodyHtml, object? JsonLd);
}
