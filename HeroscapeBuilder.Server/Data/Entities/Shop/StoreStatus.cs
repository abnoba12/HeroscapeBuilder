namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// Whether the shop is taking orders (shop.store_status, always a single row with id 1).
/// </summary>
public partial class StoreStatus
{
    public int Id { get; set; }

    public bool IsOpen { get; set; }

    /// <summary>
    /// Shown to customers while the shop is closed.
    /// </summary>
    public string? ClosedMessage { get; set; }

    /// <summary>
    /// Optional date shown to customers. The shop does not reopen by itself.
    /// </summary>
    public DateOnly? ReopensOn { get; set; }

    public DateTime UpdatedAt { get; set; }
}
