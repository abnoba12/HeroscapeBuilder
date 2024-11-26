using Microsoft.AspNetCore.Identity;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class UserCard
{
    public int Id { get; set; }

    public string UserId { get; set; } = null!;

    public int OwnedArmyCard { get; set; }

    public int Quantity { get; set; }

    public virtual ArmyCard OwnedArmyCardNavigation { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
