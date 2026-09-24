using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Domain.Shop
{
    /// <summary>
    /// A cart priced on the server: the quote shown to the customer plus the rows it was built from, so checkout
    /// can create the order from exactly what was quoted.
    /// </summary>
    /// <param name="Files">Card file id -> file (with its army card) for every valid line.</param>
    /// <param name="Formats">Format code -> format for every active format.</param>
    public record PricedCart(
        ShopQuoteEntity Quote,
        IReadOnlyDictionary<long, ArmyCardFile> Files,
        IReadOnlyDictionary<string, CardFormat> Formats);
}
