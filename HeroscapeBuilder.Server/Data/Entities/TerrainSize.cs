namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>Lookup of tile sizes (single space ... 24 space).</summary>
public partial class TerrainSize
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Spaces { get; set; }
}
