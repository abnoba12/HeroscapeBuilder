namespace HeroscapeBuilder.Server.Data.Entities.Shop;

/// <summary>
/// A Stripe webhook event that has already been processed (shop.stripe_event). Makes webhook handling idempotent.
/// </summary>
public partial class StripeEvent
{
    public string EventId { get; set; } = null!;

    public string EventType { get; set; } = null!;

    public DateTime ReceivedAt { get; set; }
}
