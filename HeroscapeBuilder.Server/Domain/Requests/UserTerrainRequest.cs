namespace HeroscapeBuilder.Server.Domain.Requests
{
    public class UserTerrainRequest
    {
        public int TerrainTypeId { get; set; }

        public int TerrainSizeId { get; set; }

        public int Quantity { get; set; }
    }
}
