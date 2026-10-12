namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>One dated observation the owner wrote about an army. Private to the owner.</summary>
public partial class ArmyBuilderJournalEntry
{
    public int Id { get; set; }

    public int ArmyBuilderId { get; set; }

    public DateOnly EntryDate { get; set; }

    public string? WentWell { get; set; }

    public string? WentPoorly { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual ArmyBuilder ArmyBuilder { get; set; } = null!;
}
