namespace HeroscapeBuilder.Server.Domain.Requests
{
    /// <summary>Multipart form posted when an administrator uploads a map.</summary>
    public class MapUploadRequest
    {
        public string? Name { get; set; }

        /// <summary>A row in the creator table. Leave empty when the map is for a customer.</summary>
        public long? CreatorId { get; set; }

        /// <summary>Free-text customer name. Only used when CreatorId is empty; never saved to the creator table.</summary>
        public string? CustomerName { get; set; }

        public int PlayerCount { get; set; }

        /// <summary>JSON array of <see cref="MapTileRequest"/>.</summary>
        public string? Tiles { get; set; }

        public IFormFile? File { get; set; }

        /// <summary>PNG or JPG preview image; stored as a WebP under map/thumbs.</summary>
        public IFormFile? Thumbnail { get; set; }
    }

    public class MapTileRequest
    {
        public int TerrainTypeId { get; set; }

        public int TerrainSizeId { get; set; }

        public int Quantity { get; set; }
    }
}
