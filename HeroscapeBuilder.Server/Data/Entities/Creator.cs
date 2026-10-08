using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Creator
{
    public long Id { get; set; }

    /// <summary>Short unique code (C3V, Heroscape, ...). army_card.Creator and set.creator store this value.</summary>
    public string Abbreviation { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ArmyCard> ArmyCards { get; set; } = new List<ArmyCard>();

    public virtual ICollection<Set> Sets { get; set; } = new List<Set>();
}
