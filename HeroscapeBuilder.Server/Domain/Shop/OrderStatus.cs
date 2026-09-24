namespace HeroscapeBuilder.Server.Domain.Shop
{
    /// <summary>
    /// Values of shop.customer_order.Status (kept in sync with CK_customer_order_Status in DB/Shop.sql).
    /// </summary>
    public static class OrderStatus
    {
        /// <summary>Checkout started but Stripe has not confirmed payment.</summary>
        public const string Pending = "Pending";

        /// <summary>Payment confirmed; waiting to be made.</summary>
        public const string Paid = "Paid";

        public const string InProduction = "InProduction";

        public const string Shipped = "Shipped";

        public const string Cancelled = "Cancelled";

        public const string Refunded = "Refunded";

        /// <summary>The Stripe checkout session expired without payment.</summary>
        public const string Expired = "Expired";

        /// <summary>
        /// Statuses the shop owner can move a paid order between by hand. Pending, Expired and Refunded are driven by Stripe.
        /// </summary>
        public static readonly IReadOnlyList<string> AdminSettable = new[] { Paid, InProduction, Shipped, Cancelled };

        /// <summary>
        /// Orders that have been paid for, i.e. real orders rather than abandoned checkouts.
        /// </summary>
        public static readonly IReadOnlyList<string> Placed = new[] { Paid, InProduction, Shipped, Cancelled, Refunded };

        public static string FormatNumber(int orderId) => $"HSB-{orderId:D5}";
    }
}
