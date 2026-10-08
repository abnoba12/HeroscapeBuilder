namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>A size a terrain type comes in. A type with no rows here is allowed in every size.</summary>
public partial class TerrainTypeSize
{
    public int TerrainTypeId { get; set; }

    public int TerrainSizeId { get; set; }
}
