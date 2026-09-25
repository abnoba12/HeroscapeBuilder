using System.Text.Json.Serialization;

namespace HeroscapeBuilder.Server.Domain.Entities
{
    /// <summary>
    /// The competing sets of unit point values. Standard is the baseline every unit has;
    /// Renegade and Delta override it for some units.
    /// </summary>
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum PointSystem
    {
        /// <summary>Hasbro's original points, or the printed points for units Renegade produced.</summary>
        Standard,

        /// <summary>Renegade's official points adjustments to original units.</summary>
        Renegade,

        /// <summary>Community-maintained Delta points.</summary>
        Delta,
    }

    public static class PointSystemExtensions
    {
        public const PointSystem Default = PointSystem.Renegade;

        /// <summary>
        /// The unit's points under <paramref name="system"/>, falling back to Standard when there is no override.
        /// </summary>
        public static int? Resolve(this PointSystem system, int? standard, int? renegade, int? delta)
        {
            var overridePoints = system switch
            {
                PointSystem.Renegade => renegade,
                PointSystem.Delta => delta,
                _ => null,
            };
            return overridePoints ?? standard;
        }

        public static int? PointsFor(this UnitEntity unit, PointSystem system)
        {
            return system.Resolve(unit.StandardPoints, unit.RenegadePoints, unit.DeltaPoints);
        }
    }
}
