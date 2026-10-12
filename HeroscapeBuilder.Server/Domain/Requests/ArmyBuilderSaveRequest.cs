using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Domain.Requests
{
    public class BattlegroupSaveRequest
    {
        public string? Name { get; set; }

        public int PointLimit { get; set; }

        public PointSystem PointSystem { get; set; } = PointSystemExtensions.Default;

        /// <summary>One creator, or several separated by commas. Null/blank = any creator.</summary>
        public string? Creator { get; set; }

        /// <summary>Lets the army use units (or quantities) the user doesn't own yet, for planning future purchases.</summary>
        public bool AllowUnowned { get; set; }

        public string? Notes { get; set; }

        public List<BattlegroupUnitRequest> Units { get; set; } = new List<BattlegroupUnitRequest>();
    }

    public class BattlegroupUnitRequest
    {
        public int UnitId { get; set; }

        public int Quantity { get; set; }
    }
}
