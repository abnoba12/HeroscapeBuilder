namespace HeroscapeBuilder.Server.Domain.Entities
{
    // API models for the card shop. All money is in cents (USD).

    public class ShopFormatEntity
    {
        public string Code { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public string FilePurpose { get; set; } = null!;

        public int UnitPriceCents { get; set; }

        public int TurnaroundMinDays { get; set; }

        public int TurnaroundMaxDays { get; set; }

        public bool IsActive { get; set; }

        public int SortOrder { get; set; }
    }

    public class ShopDiscountTierEntity
    {
        public int MinQuantity { get; set; }

        public decimal PercentOff { get; set; }
    }

    public class ShopShippingOptionEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int AmountCents { get; set; }

        public int MinBusinessDays { get; set; }

        public int MaxBusinessDays { get; set; }

        public bool IsActive { get; set; }
    }

    /// <summary>
    /// Whether the shop is taking orders. Closed shops can still be browsed, but checkout is refused.
    /// </summary>
    public class ShopStoreStatusEntity
    {
        public bool IsOpen { get; set; }

        public string? ClosedMessage { get; set; }

        public DateOnly? ReopensOn { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class ShopCatalogEntity
    {
        public bool CheckoutEnabled { get; set; }

        public ShopStoreStatusEntity Store { get; set; } = new ShopStoreStatusEntity();

        public List<ShopFormatEntity> Formats { get; set; } = new List<ShopFormatEntity>();

        public List<ShopDiscountTierEntity> DiscountTiers { get; set; } = new List<ShopDiscountTierEntity>();

        public List<ShopShippingOptionEntity> ShippingOptions { get; set; } = new List<ShopShippingOptionEntity>();

        public List<ShopCatalogUnitEntity> Units { get; set; } = new List<ShopCatalogUnitEntity>();
    }

    /// <summary>
    /// A unit and every card file of it that can be ordered, across all active formats.
    /// </summary>
    public class ShopCatalogUnitEntity
    {
        public int ArmyCardId { get; set; }

        public string Name { get; set; } = null!;

        public string? Creator { get; set; }

        public List<ShopCatalogOptionEntity> Options { get; set; } = new List<ShopCatalogOptionEntity>();
    }

    public class ShopCatalogOptionEntity
    {
        public long ArmyCardFileId { get; set; }

        public string FormatCode { get; set; } = null!;

        /// <summary>
        /// Distinguishes versions when a unit has more than one card file in the same format (the file name).
        /// </summary>
        public string? Version { get; set; }

        public string? FilePath { get; set; }

        public string? Thumb { get; set; }
    }

    public class ShopQuoteEntity
    {
        public List<ShopQuoteLineEntity> Lines { get; set; } = new List<ShopQuoteLineEntity>();

        public List<ShopQuoteFormatEntity> Formats { get; set; } = new List<ShopQuoteFormatEntity>();

        public int CardCount { get; set; }

        public int SubtotalCents { get; set; }

        public decimal DiscountPercent { get; set; }

        public int DiscountCents { get; set; }

        /// <summary>
        /// Subtotal after the discount. Shipping (and tax, if enabled) are added on the Stripe checkout page.
        /// </summary>
        public int TotalCents { get; set; }

        public ShopNextTierEntity? NextTier { get; set; }

        public ShopStoreStatusEntity Store { get; set; } = new ShopStoreStatusEntity();

        /// <summary>
        /// Every discount tier, so the cart can show progress toward each one.
        /// </summary>
        public List<ShopDiscountTierEntity> DiscountTiers { get; set; } = new List<ShopDiscountTierEntity>();

        /// <summary>
        /// Longest production time among the formats in the cart.
        /// </summary>
        public int TurnaroundMinDays { get; set; }

        public int TurnaroundMaxDays { get; set; }

        /// <summary>
        /// Cart items that could not be priced (removed from the catalog, bad quantity, ...). They are left out of the totals.
        /// </summary>
        public List<string> Errors { get; set; } = new List<string>();

        /// <summary>
        /// File ids from the request that are no longer orderable, so the browser can drop them from the cart.
        /// </summary>
        public List<long> InvalidFileIds { get; set; } = new List<long>();
    }

    public class ShopQuoteLineEntity
    {
        public long ArmyCardFileId { get; set; }

        public int ArmyCardId { get; set; }

        public string UnitName { get; set; } = null!;

        public string? Creator { get; set; }

        public string FormatCode { get; set; } = null!;

        public string FormatName { get; set; } = null!;

        public string? Thumb { get; set; }

        public int Quantity { get; set; }

        public int UnitPriceCents { get; set; }

        public int LineTotalCents { get; set; }
    }

    public class ShopQuoteFormatEntity
    {
        public string FormatCode { get; set; } = null!;

        public string FormatName { get; set; } = null!;

        public int Quantity { get; set; }

        public int UnitPriceCents { get; set; }

        public int SubtotalCents { get; set; }
    }

    public class ShopNextTierEntity
    {
        public int MinQuantity { get; set; }

        public decimal PercentOff { get; set; }

        public int CardsNeeded { get; set; }
    }

    public class ShopCheckoutEntity
    {
        /// <summary>
        /// Stripe-hosted checkout page to send the customer to.
        /// </summary>
        public string Url { get; set; } = null!;
    }

    public class ShopOrderSummaryEntity
    {
        public int Id { get; set; }

        public string OrderNumber { get; set; } = null!;

        public Guid AccessKey { get; set; }

        public string Status { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime? PaidAt { get; set; }

        public int CardCount { get; set; }

        public int TotalCents { get; set; }

        public string? CustomerName { get; set; }

        public string? Email { get; set; }

        /// <summary>
        /// False while a paid order's "new order" email to the owner has not gone out yet.
        /// </summary>
        public bool OwnerNotified { get; set; }
    }

    /// <summary>
    /// An order as the customer sees it (no admin notes or Stripe ids).
    /// </summary>
    public class ShopOrderEntity
    {
        public string OrderNumber { get; set; } = null!;

        public Guid AccessKey { get; set; }

        public string Status { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public DateTime? PaidAt { get; set; }

        public DateTime? ShippedAt { get; set; }

        public int CardCount { get; set; }

        public int SubtotalCents { get; set; }

        public decimal DiscountPercent { get; set; }

        public int DiscountCents { get; set; }

        public int ShippingCents { get; set; }

        public int TaxCents { get; set; }

        public int TotalCents { get; set; }

        public string? Email { get; set; }

        public string? ShippingMethod { get; set; }

        public ShopAddressEntity? ShipTo { get; set; }

        public string? Carrier { get; set; }

        public string? TrackingNumber { get; set; }

        public int TurnaroundMinDays { get; set; }

        public int TurnaroundMaxDays { get; set; }

        public List<ShopOrderItemEntity> Items { get; set; } = new List<ShopOrderItemEntity>();
    }

    /// <summary>
    /// The shop owner's view of an order.
    /// </summary>
    public class ShopAdminOrderEntity : ShopOrderEntity
    {
        public int Id { get; set; }

        public string? CustomerName { get; set; }

        public string? Phone { get; set; }

        public string? AccountEmail { get; set; }

        public string? AdminNotes { get; set; }

        public string? StripePaymentIntentId { get; set; }

        public string? StripeCheckoutSessionId { get; set; }

        public DateTime UpdatedAt { get; set; }

        public DateTime? OwnerNotifiedAt { get; set; }

        /// <summary>
        /// Card counts per format, for planning production.
        /// </summary>
        public List<ShopQuoteFormatEntity> Formats { get; set; } = new List<ShopQuoteFormatEntity>();
    }

    public class ShopAddressEntity
    {
        public string? Name { get; set; }

        public string? Line1 { get; set; }

        public string? Line2 { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? PostalCode { get; set; }

        public string? Country { get; set; }
    }

    public class ShopOrderItemEntity
    {
        public long? ArmyCardFileId { get; set; }

        public int? ArmyCardId { get; set; }

        public string UnitName { get; set; } = null!;

        public string? Creator { get; set; }

        public string FormatCode { get; set; } = null!;

        public string FormatName { get; set; } = null!;

        public string? FilePath { get; set; }

        public int Quantity { get; set; }

        public int UnitPriceCents { get; set; }

        public int LineTotalCents { get; set; }
    }

    public class ShopSettingsEntity
    {
        public bool StripeConfigured { get; set; }

        public bool WebhookConfigured { get; set; }

        public bool StripeTestMode { get; set; }

        public bool EmailConfigured { get; set; }

        /// <summary>
        /// Where new order emails go.
        /// </summary>
        public string? NotifyEmail { get; set; }

        public ShopStoreStatusEntity Store { get; set; } = new ShopStoreStatusEntity();

        public List<ShopFormatEntity> Formats { get; set; } = new List<ShopFormatEntity>();

        public List<ShopDiscountTierEntity> DiscountTiers { get; set; } = new List<ShopDiscountTierEntity>();

        public List<ShopShippingOptionEntity> ShippingOptions { get; set; } = new List<ShopShippingOptionEntity>();

        public List<ShopCreatorEntity> Creators { get; set; } = new List<ShopCreatorEntity>();
    }

    public class ShopCreatorEntity
    {
        public string Creator { get; set; } = null!;

        public bool IsSellable { get; set; }

        /// <summary>
        /// Number of card files from this creator in the shop's formats.
        /// </summary>
        public int FileCount { get; set; }
    }
}
