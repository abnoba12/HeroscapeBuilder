namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// A physical card format that can be ordered (shop.card_format).
/// </summary>
public partial class CardFormat
{
    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    /// <summary>
    /// Matches dbo.army_card_files.file_purpose, e.g. "Standard_Army_Card".
    /// </summary>
    public string FilePurpose { get; set; } = null!;

    public int UnitPriceCents { get; set; }

    public int TurnaroundMinDays { get; set; }

    public int TurnaroundMaxDays { get; set; }

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }
}
