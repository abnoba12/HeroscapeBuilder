using System;
using System.Collections.Generic;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyCardFile
{
    public long Id { get; set; }

    public int ArmyCardId { get; set; }

    public string FilePurpose { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public long? Parent { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;

    public virtual ICollection<ArmyCardFile> InverseParentNavigation { get; set; } = new List<ArmyCardFile>();

    public virtual ArmyCardFile? ParentNavigation { get; set; }
}
