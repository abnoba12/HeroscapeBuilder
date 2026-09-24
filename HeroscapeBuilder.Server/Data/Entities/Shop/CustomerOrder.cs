namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// A card order (shop.customer_order). See <see cref="Domain.Shop.OrderStatus"/> for the status values.
/// </summary>
public partial class CustomerOrder
{
    public int Id { get; set; }

    public string? UserId { get; set; }

    public Guid AccessKey { get; set; }

    public string Status { get; set; } = null!;

    public int CardCount { get; set; }

    public int SubtotalCents { get; set; }

    public decimal DiscountPercent { get; set; }

    public int DiscountCents { get; set; }

    public int ShippingCents { get; set; }

    public int TaxCents { get; set; }

    public int TotalCents { get; set; }

    public string? Email { get; set; }

    public string? CustomerName { get; set; }

    public string? Phone { get; set; }

    public string? ShipName { get; set; }

    public string? ShipLine1 { get; set; }

    public string? ShipLine2 { get; set; }

    public string? ShipCity { get; set; }

    public string? ShipState { get; set; }

    public string? ShipPostalCode { get; set; }

    public string? ShipCountry { get; set; }

    public string? ShippingMethod { get; set; }

    public string? StripeCheckoutSessionId { get; set; }

    public string? StripePaymentIntentId { get; set; }

    public string? Carrier { get; set; }

    public string? TrackingNumber { get; set; }

    public string? AdminNotes { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime? ShippedAt { get; set; }

    public virtual ApplicationUser? User { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
