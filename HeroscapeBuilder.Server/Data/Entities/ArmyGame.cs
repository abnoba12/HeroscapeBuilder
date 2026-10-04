namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>One logged win or loss for one of a user's armies.</summary>
public partial class ArmyGame
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    /// <summary>Null once the army was deleted; the result is kept.</summary>
    public int? BattlegroupId { get; set; }

    public bool Won { get; set; }

    public DateTime PlayedAt { get; set; }

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ArmyGameUnit> Units { get; set; } = new List<ArmyGameUnit>();
}
