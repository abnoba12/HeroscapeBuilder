namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// Quantity discount applied to the total card count of an order across all formats (shop.discount_tier).
/// </summary>
public partial class DiscountTier
{
    public int Id { get; set; }

    public int MinQuantity { get; set; }

    public decimal PercentOff { get; set; }
}
