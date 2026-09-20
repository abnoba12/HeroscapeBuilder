namespace HeroscapeBuilder.Server.Domain.Requests
{
    public class BattlegroupSaveRequest
    {
        public string? Name { get; set; }

        public int PointLimit { get; set; }

        public string? Creator { get; set; }

        public string? Notes { get; set; }

        public List<BattlegroupUnitRequest> Units { get; set; } = new List<BattlegroupUnitRequest>();
    }

    public class BattlegroupUnitRequest
    {
        public int UnitId { get; set; }

        public int Quantity { get; set; }
    }
}
