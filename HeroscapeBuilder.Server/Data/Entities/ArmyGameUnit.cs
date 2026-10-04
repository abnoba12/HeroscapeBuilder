namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>A unit that was in the army when a game was logged, with its points at that time.</summary>
public partial class ArmyGameUnit
{
    public int Id { get; set; }

    public int ArmyGameId { get; set; }

    public int ArmyCardId { get; set; }

    public int Quantity { get; set; }

    public int Points { get; set; }

    public virtual ArmyGame ArmyGame { get; set; } = null!;
}
