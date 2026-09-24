using HeroscapeBuilder.Server.Data.Entities.Shop;

namespace HeroscapeBuilder.Server.Domain.Shop
{
    /// <summary>
    /// Price math shared by the cart quote and checkout, so the customer is always charged exactly what they were quoted.
    /// </summary>
    public static class ShopPricing
    {
        /// <summary>
        /// The highest tier the card count reaches (null when none), and the next tier up (null when already at the top).
        /// Card count is the total across all formats combined.
        /// </summary>
        public static (DiscountTier? Applied, DiscountTier? Next) FindTiers(int cardCount, IEnumerable<DiscountTier> tiers)
        {
            var ordered = tiers.OrderBy(x => x.MinQuantity).ToList();
            var applied = ordered.LastOrDefault(x => x.MinQuantity <= cardCount);
            var next = ordered.FirstOrDefault(x => x.MinQuantity > cardCount);
            return (applied, next);
        }

        public static int DiscountCents(int subtotalCents, decimal percentOff)
        {
            return (int)Math.Round(subtotalCents * percentOff / 100m, MidpointRounding.AwayFromZero);
        }
    }
}
