namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>Lookup of terrain types (Grass, Sand, ...). New types are added with a plain INSERT.</summary>
public partial class TerrainType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    /// <summary>Same-size tiles of types sharing this group can stand in for each other. Null = special rules, never swapped.</summary>
    public string? SwapGroup { get; set; }

    /// <summary>Replaces SwapGroup for single space tiles only (water, trees, columns).</summary>
    public string? SingleSwapGroup { get; set; }
}
