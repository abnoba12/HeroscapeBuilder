using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Terrain
{
    public long Id { get; set; }

    public short? Hexes { get; set; }

    public string Type { get; set; } = null!;

    public virtual ICollection<SetTerrain> SetTerrains { get; set; } = new List<SetTerrain>();
}
