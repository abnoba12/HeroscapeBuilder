using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyCardAbility
{
    public int Id { get; set; }

    public int ArmyCardId { get; set; }

    public string? Abilityname { get; set; }

    public string? Ability { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;
}
