using HeroscapeBuilder.Server.Common.Helpers;

namespace HeroscapeBuilder.Server.Data.Entities;

public partial class ArmyCardFile
{
    public long Id { get; set; }

    public int ArmyCardId { get; set; }

    public string FilePurpose { get; set; } = null!;

    private string _filePath = null!;
    public string FilePath
    {
        get => _filePath.PrependFilePath();
        set => _filePath = value;
    }

    public DateTime CreatedAt { get; set; }

    public virtual ArmyCard ArmyCard { get; set; } = null!;

    public long? ParentId { get; set; }
    public ArmyCardFile Parent { get; set; } // Navigation property for the parent
    public ICollection<ArmyCardFile> Children { get; set; } = new List<ArmyCardFile>();
}
