using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Domain.Requests
{
    public class ArmyBuilderSaveRequest
    {
        /// <summary>
        /// When creating: the army to add this variation to. The name then comes from that army; everything else
        /// is the variation's own.
        /// </summary>
        public int? ArmyId { get; set; }

        public string? Name { get; set; }

        /// <summary>Optional name for this variation ("Tournament"); blank = just show its point limit.</summary>
        public string? VariationLabel { get; set; }

        public int PointLimit { get; set; }

        public PointSystem PointSystem { get; set; } = PointSystemExtensions.Default;

        /// <summary>One creator, or several separated by commas. Null/blank = any creator.</summary>
        public string? Creator { get; set; }

        /// <summary>Lets the army use units (or quantities) the user doesn't own yet, for planning future purchases.</summary>
        public bool AllowUnowned { get; set; }

        public string? Notes { get; set; }

        public List<ArmyBuilderUnitRequest> Units { get; set; } = new List<ArmyBuilderUnitRequest>();
    }

    public class ArmyBuilderUnitRequest
    {
        public int UnitId { get; set; }

        public int Quantity { get; set; }
    }
}
