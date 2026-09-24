namespace HeroscapeBuilder.Server.Domain.Requests
{
    /// <summary>
    /// The cart sent from the browser. Only file ids and quantities are trusted; every price is looked up on the server.
    /// </summary>
    public class ShopCartRequest
    {
        public List<ShopCartItemRequest> Items { get; set; } = new List<ShopCartItemRequest>();
    }

    public class ShopCartItemRequest
    {
        /// <summary>
        /// dbo.army_card_files.id. The file's purpose decides the card format.
        /// </summary>
        public long ArmyCardFileId { get; set; }

        public int Quantity { get; set; }
    }

    public class ShopOrderUpdateRequest
    {
        public string? Status { get; set; }

        public string? Carrier { get; set; }

        public string? TrackingNumber { get; set; }

        public string? AdminNotes { get; set; }
    }

    public class ShopSettingsSaveRequest
    {
        public List<ShopFormatSaveRequest> Formats { get; set; } = new List<ShopFormatSaveRequest>();

        public List<ShopDiscountTierSaveRequest> DiscountTiers { get; set; } = new List<ShopDiscountTierSaveRequest>();

        public List<ShopShippingOptionSaveRequest> ShippingOptions { get; set; } = new List<ShopShippingOptionSaveRequest>();

        public List<ShopCreatorSaveRequest> Creators { get; set; } = new List<ShopCreatorSaveRequest>();
    }

    public class ShopFormatSaveRequest
    {
        public string Code { get; set; } = null!;

        public string? Name { get; set; }

        public string? Description { get; set; }

        public int UnitPriceCents { get; set; }

        public int TurnaroundMinDays { get; set; }

        public int TurnaroundMaxDays { get; set; }

        public bool IsActive { get; set; }

        public int SortOrder { get; set; }
    }

    public class ShopDiscountTierSaveRequest
    {
        public int MinQuantity { get; set; }

        public decimal PercentOff { get; set; }
    }

    public class ShopShippingOptionSaveRequest
    {
        public string? Name { get; set; }

        public int AmountCents { get; set; }

        public int MinBusinessDays { get; set; }

        public int MaxBusinessDays { get; set; }

        public bool IsActive { get; set; }
    }

    public class ShopCreatorSaveRequest
    {
        public string Creator { get; set; } = null!;

        public bool IsSellable { get; set; }
    }
}
