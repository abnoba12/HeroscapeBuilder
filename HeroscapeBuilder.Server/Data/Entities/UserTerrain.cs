namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>Terrain a user owns: one row per terrain type + size.</summary>
public partial class UserTerrain
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public int TerrainTypeId { get; set; }

    public int TerrainSizeId { get; set; }

    public int Quantity { get; set; }

    public virtual TerrainType TerrainType { get; set; } = null!;

    public virtual TerrainSize TerrainSize { get; set; } = null!;
}
