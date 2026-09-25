namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>
/// Point values for a unit under each point system. Standard is always set; Renegade and Delta are
/// overrides that are only stored when they differ from Standard.
/// </summary>
public partial class ArmyCardPoints
{
    public int ArmyCardId { get; set; }

    public int StandardPoints { get; set; }

    public int? RenegadePoints { get; set; }

    public int? DeltaPoints { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;
}
