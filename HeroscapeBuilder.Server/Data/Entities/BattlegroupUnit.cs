namespace HeroscapeBuilder.Server.Data.Entities;

public partial class BattlegroupUnit
{
    public int Id { get; set; }

    public int BattlegroupId { get; set; }

    public int ArmyCardId { get; set; }

    public int Quantity { get; set; }

    public virtual Battlegroup Battlegroup { get; set; } = null!;

    public virtual ArmyCard ArmyCard { get; set; } = null!;
}
