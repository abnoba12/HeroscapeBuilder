using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Creator
{
    public long Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public string CreatorName { get; set; } = null!;

    public virtual ICollection<ArmyCard> ArmyCards { get; set; } = new List<ArmyCard>();

    public virtual ICollection<Set> Sets { get; set; } = new List<Set>();
}
