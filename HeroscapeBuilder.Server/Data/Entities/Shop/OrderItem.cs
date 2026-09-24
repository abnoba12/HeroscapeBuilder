namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// One card file in one format on an order (shop.order_item). Name, format and price are snapshots taken at
/// checkout so later catalog or price changes never alter an existing order.
/// </summary>
public partial class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public long? ArmyCardFileId { get; set; }

    public int? ArmyCardId { get; set; }

    public string FormatCode { get; set; } = null!;

    public string FormatName { get; set; } = null!;

    public string UnitName { get; set; } = null!;

    public string? Creator { get; set; }

    public string? FilePath { get; set; }

    public int Quantity { get; set; }

    public int UnitPriceCents { get; set; }

    public virtual CustomerOrder Order { get; set; } = null!;
}
