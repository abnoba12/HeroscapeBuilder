using HeroscapeBuilder.Server.Common.Helpers;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class MapOptionsEntity
    {
        public List<MapCreatorOption> Creators { get; set; } = new();

        public List<MapTerrainTypeOption> TerrainTypes { get; set; } = new();

        public List<MapTerrainSizeOption> TerrainSizes { get; set; } = new();
    }

    public class MapCreatorOption
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;
    }

    public class MapTerrainTypeOption
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        /// <summary>Sizes this type comes in. Empty means the type is allowed in every size.</summary>
        public List<int> AllowedSizeIds { get; set; } = new();
    }

    public class MapTerrainSizeOption
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int Spaces { get; set; }
    }

    public class MapEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        /// <summary>Set for maps by a known creator; otherwise <see cref="CustomerName"/> is set.</summary>
        public long? CreatorId { get; set; }

        public string? CreatorName { get; set; }

        /// <summary>Short creator code (C3V, ...), used to pick the creator's logo.</summary>
        public string? CreatorAbbreviation { get; set; }

        public string? CustomerName { get; set; }

        public int PlayerCount { get; set; }

        public string RawFilePath { get; set; } = null!;
        public string FilePath
        {
            get => RawFilePath.PrependFilePath();
            set => RawFilePath = value;
        }

        public string RawThumbnailPath { get; set; } = null!;
        public string ThumbnailPath
        {
            get => RawThumbnailPath.PrependFilePath();
            set => RawThumbnailPath = value;
        }

        public DateTime CreatedAt { get; set; }

        public List<MapTileEntity> Tiles { get; set; } = new();

        /// <summary>Total number of tiles (sum of all quantities).</summary>
        public int TileCount => Tiles.Sum(t => t.Quantity);

        /// <summary>Total number of spaces (hexes) across all tiles.</summary>
        public int SpaceCount => Tiles.Sum(t => t.Quantity * t.Spaces);
    }

    public class MapTileEntity
    {
        public int TerrainTypeId { get; set; }

        public int TerrainSizeId { get; set; }

        /// <summary>Spaces (hexes) one tile of this size covers.</summary>
        public int Spaces { get; set; }

        public int Quantity { get; set; }
    }
}
