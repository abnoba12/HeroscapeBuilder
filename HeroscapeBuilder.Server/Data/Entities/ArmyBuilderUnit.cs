namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyBuilderUnit
{
    public int Id { get; set; }

    public int ArmyBuilderId { get; set; }

    public int ArmyCardId { get; set; }

    public int Quantity { get; set; }

    public virtual ArmyBuilder ArmyBuilder { get; set; } = null!;

    public virtual ArmyCard ArmyCard { get; set; } = null!;
}
