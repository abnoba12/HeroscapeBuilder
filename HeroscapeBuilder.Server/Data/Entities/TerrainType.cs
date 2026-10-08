namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>Lookup of terrain types (Grass, Sand, ...). New types are added with a plain INSERT.</summary>
public partial class TerrainType
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;
}
