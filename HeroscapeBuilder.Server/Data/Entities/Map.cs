namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Map
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    /// <summary>Set for maps made by a known creator. Exactly one of CreatorId / CustomerName is set.</summary>
    public long? CreatorId { get; set; }

    /// <summary>Free-text customer name. Never saved to the creator table.</summary>
    public string? CustomerName { get; set; }

    public int PlayerCount { get; set; }

    /// <summary>Free-text scenario the map was made for. Null when the map isn't tied to one.</summary>
    public string? Scenario { get; set; }

    /// <summary>Location of the PDF in file storage, including the bucket (e.g. /map/my-map-1a2b3c4d.pdf).</summary>
    public string FilePath { get; set; } = null!;

    /// <summary>Location of the thumbnail image, including the bucket (e.g. /map/thumbs/my-map-1a2b3c4d.webp).</summary>
    public string ThumbnailPath { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual Creator? Creator { get; set; }

    public virtual ICollection<MapTile> Tiles { get; set; } = new List<MapTile>();
}
