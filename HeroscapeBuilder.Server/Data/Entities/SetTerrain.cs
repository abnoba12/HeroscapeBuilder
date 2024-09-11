using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class SetTerrain
{
    public long Id { get; set; }

    public long Set { get; set; }

    public long Terrain { get; set; }

    public short Quantity { get; set; }

    public virtual Set SetNavigation { get; set; } = null!;

    public virtual Terrain TerrainNavigation { get; set; } = null!;
}
