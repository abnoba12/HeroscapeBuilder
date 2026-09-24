using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Shop;
using Stripe;

namespace HeroscapeBuilder.Server.Integrations.StripePayments
{
    /// <summary>
    /// Holds the one StripeClient for the app (registered as a singleton so its HTTP connections are reused).
    /// The site still starts without a Stripe key; only checkout-related calls fail until one is configured.
    /// </summary>
    public class StripeClientProvider
    {
        private readonly IStripeClient? _client;

        public StripeClientProvider(ShopSettings settings)
        {
            if (settings.StripeConfigured)
            {
                try
                {
                    _client = new StripeClient(settings.StripeSecretKey);
                    IsTestMode = settings.StripeSecretKey!.StartsWith("sk_test_", StringComparison.Ordinal)
                        || settings.StripeSecretKey.StartsWith("rk_test_", StringComparison.Ordinal);
                }
                catch (ArgumentException ex)
                {
                    // A malformed key disables checkout (with a clear log line) rather than breaking every shop request.
                    NLog.LogManager.GetLogger("HeroscapeBuilder.Shop").Error($"Card shop: the Stripe secret key is not valid ({ex.Message}). Checkout is disabled.");
                }
            }
        }

        public bool IsTestMode { get; }

        public IStripeClient Client => _client
            ?? throw new ShopException(ShopErrorKind.Unavailable, "Online checkout is not available right now. Please try again later.");
    }
}
