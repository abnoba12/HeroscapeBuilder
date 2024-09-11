using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>
/// A list of stats and abilities for each unit in Heroscape
/// </summary>
public partial class ArmyCard
{
    public string Creator { get; set; } = null!;

    public string? General { get; set; }

    public string? Name { get; set; }

    public string? Race { get; set; }

    public string? Role { get; set; }

    public string? Personality { get; set; }

    public string? Rarity { get; set; }

    public string? Type { get; set; }

    public string? SizeCategory { get; set; }

    public long? Size { get; set; }

    public long? Life { get; set; }

    public long? AdvMove { get; set; }

    public long? AdvRange { get; set; }

    public long? AdvAttack { get; set; }

    public long? AdvDefense { get; set; }

    public long? Points { get; set; }

    public long? BasicMove { get; set; }

    public long? BasicRange { get; set; }

    public long? BasicAttack { get; set; }

    public long? BasicDefense { get; set; }

    public string? Planet { get; set; }

    public string? UnitNumbers { get; set; }

    public int Id { get; set; }

    public long? Set { get; set; }

    public string? Note { get; set; }

    public virtual ICollection<ArmyCardAbility> ArmyCardAbilities { get; set; } = new List<ArmyCardAbility>();

    public virtual ICollection<ArmyCardFile> ArmyCardFiles { get; set; } = new List<ArmyCardFile>();

    public virtual Creator CreatorNavigation { get; set; } = null!;

    public virtual Set? SetNavigation { get; set; }
}
