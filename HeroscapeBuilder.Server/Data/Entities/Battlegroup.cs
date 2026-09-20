namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Battlegroup
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int PointLimit { get; set; }

    /// <summary>
    /// When set, every unit in the battlegroup must come from this creator. Null means any creator.
    /// </summary>
    public string? Creator { get; set; }

    /// <summary>
    /// Free-form, plain-text notes from the owner on how to play the battlegroup.
    /// </summary>
    public string? Notes { get; set; }

    public bool IsShared { get; set; }

    public Guid ShareId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ApplicationUser User { get; set; } = null!;

    public virtual ICollection<BattlegroupUnit> BattlegroupUnits { get; set; } = new List<BattlegroupUnit>();
}
