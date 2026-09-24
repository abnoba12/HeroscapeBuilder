namespace HeroscapeBuilder.Server.Domain.Shop
{
    /// <summary>
    /// Shop and Stripe configuration, read from the "Shop" and "Stripe" config sections at startup.
    /// The Stripe keys come only from the HeroscapeBuilder environment config (keys StripeSecretKey and
    /// StripeWebhookSecret), locally and in production alike.
    /// </summary>
    public class ShopSettings
    {
        public string? StripeSecretKey { get; init; }

        /// <summary>
        /// Signing secret (whsec_...) of the Stripe webhook endpoint. Without it webhooks are rejected, but orders still
        /// complete through the checkout success page.
        /// </summary>
        public string? StripeWebhookSecret { get; init; }

        /// <summary>
        /// Public URL of the site, used for the Stripe success/cancel redirects. No trailing slash.
        /// </summary>
        public string SiteUrl { get; init; } = "https://heroscapebuilder.com";

        public string Currency { get; init; } = "usd";

        /// <summary>
        /// Two-letter country codes Stripe will accept a shipping address for.
        /// </summary>
        public List<string> ShippingCountries { get; init; } = new List<string> { "US" };

        /// <summary>
        /// Turns on Stripe Tax for checkout. Stripe Tax must be set up in the dashboard first (it has its own fee).
        /// </summary>
        public bool AutomaticTax { get; init; }

        public bool StripeConfigured => IsSet(StripeSecretKey);

        public bool WebhookConfigured => IsSet(StripeWebhookSecret);

        /// <summary>
        /// A value still holding its %Placeholder% means the environment config did not supply it.
        /// </summary>
        private static bool IsSet(string? value) => !string.IsNullOrWhiteSpace(value) && !value.StartsWith('%');
    }
}
