using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyCardStl
{
    public long Id { get; set; }

    public int ArmyCardId { get; set; }

    public string StlUrl { get; set; } = null!;

    public DateTime LastUpdated { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;
}
