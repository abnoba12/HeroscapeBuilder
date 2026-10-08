namespace HeroscapeBuilder.Server.Data.Entities;

public partial class MapTile
{
    public int Id { get; set; }

    public int MapId { get; set; }

    public int TerrainTypeId { get; set; }

    public int TerrainSizeId { get; set; }

    public int Quantity { get; set; }

    public virtual Map Map { get; set; } = null!;

    public virtual TerrainType TerrainType { get; set; } = null!;

    public virtual TerrainSize TerrainSize { get; set; } = null!;
}
