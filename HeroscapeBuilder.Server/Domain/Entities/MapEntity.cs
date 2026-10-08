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

        public int PlayerCount { get; set; }

        public string FilePath { get; set; } = null!;

        public string ThumbnailPath { get; set; } = null!;
    }
}
