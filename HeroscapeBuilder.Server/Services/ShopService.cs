using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Domain.Shop;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Customer-facing shop: the catalog, cart pricing, and order lookups.
    /// </summary>
    public class ShopService
    {
        public const int MaxQuantityPerLine = 100;
        public const int MaxCardsPerOrder = 1000;
        public const int MaxLinesPerOrder = 500;

        private static readonly TransformCaseAttribute TitleCase = new TransformCaseAttribute { Case = "Title" };

        private readonly ShopRepository _shopRepository;
        private readonly ShopSettings _settings;

        public ShopService(ShopRepository shopRepository, ShopSettings settings)
        {
            _shopRepository = shopRepository;
            _settings = settings;
        }

        public async Task<ShopCatalogEntity> GetCatalog()
        {
            var formats = (await _shopRepository.GetFormats()).Where(x => x.IsActive).ToList();
            var tiers = await _shopRepository.GetDiscountTiers();
            var shipping = await _shopRepository.GetShippingOptions(activeOnly: true);
            var unsellable = await GetUnsellableCreators();
            var store = await _shopRepository.GetStoreStatus();

            var formatByPurpose = formats.ToDictionary(x => x.FilePurpose, StringComparer.OrdinalIgnoreCase);
            // Some cards have the same PDF registered more than once; list each file once (the oldest row).
            var files = (await _shopRepository.GetCardFiles(formats.Select(x => x.FilePurpose)))
                .Where(x => !unsellable.Contains(x.ArmyCard.Creator))
                .GroupBy(x => new { x.ArmyCardId, x.FilePurpose, Path = x.FilePath.ToLowerInvariant() })
                .Select(group => group.OrderBy(x => x.Id).First())
                .ToList();

            var units = files
                .GroupBy(x => x.ArmyCardId)
                .Select(group =>
                {
                    var card = group.First().ArmyCard;
                    return new ShopCatalogUnitEntity
                    {
                        ArmyCardId = group.Key,
                        Name = UnitName(card),
                        Creator = card.Creator,
                        Options = group
                            .GroupBy(file => formatByPurpose[file.FilePurpose].Code)
                            .SelectMany(byFormat =>
                            {
                                // Only label versions when a unit has more than one card file in the same format.
                                var hasVersions = byFormat.Count() > 1;
                                return byFormat
                                    .OrderBy(file => file.FilePath, StringComparer.OrdinalIgnoreCase)
                                    .Select(file => new ShopCatalogOptionEntity
                                    {
                                        ArmyCardFileId = file.Id,
                                        FormatCode = byFormat.Key,
                                        Version = hasVersions ? Path.GetFileNameWithoutExtension(file.FilePath) : null,
                                        FilePath = file.FilePath.PrependFilePath(),
                                        Thumb = Thumb(file),
                                    });
                            })
                            .OrderBy(option => formats.FindIndex(format => format.Code == option.FormatCode))
                            .ToList(),
                    };
                })
                .OrderBy(x => x.Name, StringComparer.OrdinalIgnoreCase)
                .ToList();

            return new ShopCatalogEntity
            {
                CheckoutEnabled = _settings.StripeConfigured && store.IsOpen,
                Store = store.ToShopStoreStatusEntity(),
                Formats = formats.Select(x => x.ToShopFormatEntity()).ToList(),
                DiscountTiers = tiers.Select(x => x.ToShopDiscountTierEntity()).ToList(),
                ShippingOptions = shipping.Select(x => x.ToShopShippingOptionEntity()).ToList(),
                Units = units,
            };
        }

        public async Task<ShopQuoteEntity> GetQuote(ShopCartRequest request)
        {
            return (await PriceCart(request)).Quote;
        }

        /// <summary>
        /// Prices a cart from the database. Anything the browser sends besides file ids and quantities is ignored.
        /// Items that can no longer be ordered are reported in <see cref="ShopQuoteEntity.Errors"/> and left out.
        /// </summary>
        public async Task<PricedCart> PriceCart(ShopCartRequest request)
        {
            var quote = new ShopQuoteEntity();
            var requested = request.Items ?? new List<ShopCartItemRequest>();

            if (requested.Any(x => x.Quantity <= 0))
            {
                quote.Errors.Add("Quantities must be at least 1.");
            }

            var lines = requested
                .Where(x => x.Quantity > 0)
                .GroupBy(x => x.ArmyCardFileId)
                .ToDictionary(group => group.Key, group => group.Sum(x => x.Quantity));

            if (lines.Count > MaxLinesPerOrder)
            {
                throw new ShopException(ShopErrorKind.Validation, $"An order can have at most {MaxLinesPerOrder} different cards.");
            }

            var formats = (await _shopRepository.GetFormats()).Where(x => x.IsActive).ToList();
            var formatByPurpose = formats.ToDictionary(x => x.FilePurpose, StringComparer.OrdinalIgnoreCase);
            var tiers = await _shopRepository.GetDiscountTiers();
            var unsellable = await GetUnsellableCreators();
            var files = (await _shopRepository.GetCardFiles(lines.Keys)).ToDictionary(x => x.Id);
            var validFiles = new Dictionary<long, ArmyCardFile>();

            foreach (var (fileId, quantity) in lines)
            {
                if (!files.TryGetValue(fileId, out var file)
                    || !formatByPurpose.TryGetValue(file.FilePurpose, out var format)
                    || unsellable.Contains(file.ArmyCard.Creator))
                {
                    quote.InvalidFileIds.Add(fileId);
                    quote.Errors.Add(file == null
                        ? "A card in your cart is no longer available and was removed."
                        : $"{UnitName(file.ArmyCard)} is no longer available in this format and was removed.");
                    continue;
                }

                var name = UnitName(file.ArmyCard);
                if (quantity > MaxQuantityPerLine)
                {
                    quote.Errors.Add($"You can order at most {MaxQuantityPerLine} copies of {name} ({format.Name}).");
                    continue;
                }

                validFiles[fileId] = file;
                quote.Lines.Add(new ShopQuoteLineEntity
                {
                    ArmyCardFileId = fileId,
                    ArmyCardId = file.ArmyCardId,
                    UnitName = name,
                    Creator = file.ArmyCard.Creator,
                    FormatCode = format.Code,
                    FormatName = format.Name,
                    Thumb = Thumb(file),
                    Quantity = quantity,
                    UnitPriceCents = format.UnitPriceCents,
                    LineTotalCents = quantity * format.UnitPriceCents,
                });
            }

            quote.Lines = quote.Lines
                .OrderBy(x => formats.FindIndex(format => format.Code == x.FormatCode))
                .ThenBy(x => x.UnitName, StringComparer.OrdinalIgnoreCase)
                .ToList();

            var usedFormats = formats.Where(format => quote.Lines.Any(line => line.FormatCode == format.Code)).ToList();
            quote.Formats = usedFormats
                .Select(format =>
                {
                    var quantity = quote.Lines.Where(x => x.FormatCode == format.Code).Sum(x => x.Quantity);
                    return new ShopQuoteFormatEntity
                    {
                        FormatCode = format.Code,
                        FormatName = format.Name,
                        Quantity = quantity,
                        UnitPriceCents = format.UnitPriceCents,
                        SubtotalCents = quantity * format.UnitPriceCents,
                    };
                })
                .ToList();

            quote.CardCount = quote.Lines.Sum(x => x.Quantity);
            quote.SubtotalCents = quote.Lines.Sum(x => x.LineTotalCents);

            if (quote.CardCount > MaxCardsPerOrder)
            {
                quote.Errors.Add($"An order can have at most {MaxCardsPerOrder} cards. Please split larger orders or contact us.");
            }

            var (applied, next) = ShopPricing.FindTiers(quote.CardCount, tiers);
            quote.DiscountPercent = applied?.PercentOff ?? 0;
            quote.DiscountCents = ShopPricing.DiscountCents(quote.SubtotalCents, quote.DiscountPercent);
            quote.TotalCents = quote.SubtotalCents - quote.DiscountCents;
            quote.NextTier = next == null || quote.CardCount == 0 ? null : new ShopNextTierEntity
            {
                MinQuantity = next.MinQuantity,
                PercentOff = next.PercentOff,
                CardsNeeded = next.MinQuantity - quote.CardCount,
            };

            quote.DiscountTiers = tiers.Select(x => x.ToShopDiscountTierEntity()).ToList();
            quote.Store = (await _shopRepository.GetStoreStatus()).ToShopStoreStatusEntity();

            quote.TurnaroundMinDays = usedFormats.Count > 0 ? usedFormats.Max(x => x.TurnaroundMinDays) : 0;
            quote.TurnaroundMaxDays = usedFormats.Count > 0 ? usedFormats.Max(x => x.TurnaroundMaxDays) : 0;

            return new PricedCart(quote, validFiles, formats.ToDictionary(x => x.Code));
        }

        public async Task<ShopOrderEntity> GetOrder(Guid accessKey)
        {
            var order = await _shopRepository.GetOrderByAccessKey(accessKey);
            if (order == null || order.Status == OrderStatus.Pending || order.Status == OrderStatus.Expired)
            {
                throw new ShopException(ShopErrorKind.NotFound, "Order not found.");
            }

            return order.ToShopOrderEntity(await GetAllFormats());
        }

        public async Task<List<ShopOrderSummaryEntity>> GetMyOrders(Guid userId)
        {
            var orders = await _shopRepository.GetOrdersForUser(userId.ToString(), OrderStatus.Placed);
            return orders.Select(x => x.ToShopOrderSummaryEntity()).ToList();
        }

        public async Task<IReadOnlyDictionary<string, CardFormat>> GetAllFormats()
        {
            return (await _shopRepository.GetFormats()).ToDictionary(x => x.Code);
        }

        private async Task<HashSet<string>> GetUnsellableCreators()
        {
            var settings = await _shopRepository.GetCreatorSettings();
            return settings
                .Where(x => !x.IsSellable)
                .Select(x => x.Creator)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// What customers are told when they try to check out while the shop is closed.
        /// </summary>
        public static string ClosedMessage(StoreStatus status)
        {
            var message = string.IsNullOrWhiteSpace(status.ClosedMessage) ? "The card shop is closed right now." : status.ClosedMessage.Trim();
            return status.ReopensOn.HasValue
                ? $"{message} We expect to reopen on {status.ReopensOn.Value:MMMM d, yyyy}. Your cart will be saved."
                : $"{message} Your cart will be saved.";
        }

        public static string UnitName(ArmyCard card)
        {
            return string.IsNullOrWhiteSpace(card.Name) ? $"Unit {card.Id}" : TitleCase.Transform(card.Name.Trim());
        }

        private static string? Thumb(ArmyCardFile file)
        {
            return file.InverseParentNavigation
                .FirstOrDefault(x => x.FilePurpose.Contains("Thumb"))?.FilePath
                .PrependFilePath();
        }
    }
}
