namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// A shipping choice offered on the Stripe checkout page (shop.shipping_option).
/// </summary>
public partial class ShippingOption
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int AmountCents { get; set; }

    public int MinBusinessDays { get; set; }

    public int MaxBusinessDays { get; set; }

    public bool IsActive { get; set; }

    public int SortOrder { get; set; }
}
