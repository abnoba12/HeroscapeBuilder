using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyBuilder
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int PointLimit { get; set; }

    /// <summary>
    /// Which point values the army builder is built with; totals and the point limit are measured in it.
    /// </summary>
    public PointSystem PointSystem { get; set; }

    /// <summary>
    /// When set, every unit in the army builder must come from this creator. Null means any creator.
    /// </summary>
    public string? Creator { get; set; }

    /// <summary>
    /// Free-form, plain-text notes from the owner on how to play the army builder.
    /// </summary>
    public string? Notes { get; set; }

    public bool IsShared { get; set; }

    public Guid ShareId { get; set; }

    /// <summary>
    /// A retired army is kept but hidden from the active list on My Armies.
    /// </summary>
    public bool IsRetired { get; set; }

    public DateTime? RetiredAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Set on a variation (another version of the same army, free to differ in limit, creator, units, anything);
    /// null on the army's primary version. Name is copied from the primary and kept in sync; sharing and
    /// retiring are only read from the primary.
    /// </summary>
    public int? ParentArmyBuilderId { get; set; }

    /// <summary>Optional name for this variation ("Tournament", "Casual"); null falls back to its point limit.</summary>
    public string? VariationLabel { get; set; }

    public virtual ArmyBuilder? Parent { get; set; }

    public virtual ICollection<ArmyBuilder> Variations { get; set; } = new List<ArmyBuilder>();

    public virtual ApplicationUser User { get; set; } = null!;

    public virtual ICollection<ArmyBuilderUnit> ArmyBuilderUnits { get; set; } = new List<ArmyBuilderUnit>();
}
