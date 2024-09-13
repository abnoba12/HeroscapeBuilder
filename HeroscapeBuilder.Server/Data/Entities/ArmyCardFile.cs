namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyCardFile
{
    public long Id { get; set; }

    public int ArmyCardId { get; set; }

    public string FilePurpose { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;

    public long? ParentId { get; set; }
    public ArmyCardFile Parent { get; set; } // Navigation property for the parent
    public ICollection<ArmyCardFile> Children { get; set; } = new List<ArmyCardFile>();
}
