using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Domain.Shop;
using HeroscapeBuilder.Server.Integrations.StripePayments;
using Stripe;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Shop owner tools: working through orders and editing prices, discounts, shipping and sellable creators.
    /// </summary>
    public class ShopAdminService
    {
        private const int MaxNotesLength = 10000;

        private readonly ShopRepository _shopRepository;
        private readonly ShopService _shopService;
        private readonly StripeClientProvider _stripe;
        private readonly ShopSettings _settings;
        private readonly ILogger<ShopAdminService> _logger;

        public ShopAdminService(ShopRepository shopRepository, ShopService shopService, StripeClientProvider stripe, ShopSettings settings, ILogger<ShopAdminService> logger)
        {
            _shopRepository = shopRepository;
            _shopService = shopService;
            _stripe = stripe;
            _settings = settings;
            _logger = logger;
        }

        /// <summary>
        /// Orders with the given status, or every placed (paid at some point) order when no status is given.
        /// "Abandoned" lists checkouts that were never paid.
        /// </summary>
        public async Task<List<ShopOrderSummaryEntity>> GetOrders(string? status)
        {
            IEnumerable<string> statuses = status switch
            {
                null or "" => OrderStatus.Placed,
                "Abandoned" => new[] { OrderStatus.Pending, OrderStatus.Expired },
                _ => new[] { status },
            };

            var orders = await _shopRepository.GetOrders(statuses);
            return orders.Select(x => x.ToShopOrderSummaryEntity()).ToList();
        }

        public async Task<ShopAdminOrderEntity> GetOrder(int id)
        {
            var order = await _shopRepository.GetOrder(id) ?? throw NotFound();
            return order.ToShopAdminOrderEntity(await _shopService.GetAllFormats());
        }

        public async Task<ShopAdminOrderEntity> UpdateOrder(int id, ShopOrderUpdateRequest request)
        {
            var order = await _shopRepository.GetOrder(id, track: true) ?? throw NotFound();
            var errors = new List<string>();

            if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != order.Status)
            {
                if (!OrderStatus.AdminSettable.Contains(order.Status))
                {
                    errors.Add($"A {order.Status} order's status is managed by Stripe and can't be changed here.");
                }
                else if (!OrderStatus.AdminSettable.Contains(request.Status))
                {
                    errors.Add($"Status must be one of: {string.Join(", ", OrderStatus.AdminSettable)}.");
                }
                else
                {
                    order.Status = request.Status;
                    if (request.Status == OrderStatus.Shipped)
                    {
                        order.ShippedAt ??= DateTime.UtcNow;
                    }
                }
            }

            order.Carrier = Clean(request.Carrier, 50, "Carrier", errors);
            order.TrackingNumber = Clean(request.TrackingNumber, 100, "Tracking number", errors);
            order.AdminNotes = Clean(request.AdminNotes, MaxNotesLength, "Notes", errors);

            if (errors.Count > 0)
            {
                throw new ShopException(ShopErrorKind.Validation, errors.ToArray());
            }

            order.UpdatedAt = DateTime.UtcNow;
            await _shopRepository.SaveChanges();

            return await GetOrder(id);
        }

        /// <summary>
        /// Refunds the full payment through Stripe and marks the order Refunded.
        /// </summary>
        public async Task<ShopAdminOrderEntity> RefundOrder(int id)
        {
            var order = await _shopRepository.GetOrder(id, track: true) ?? throw NotFound();

            if (!OrderStatus.AdminSettable.Contains(order.Status) || string.IsNullOrEmpty(order.StripePaymentIntentId))
            {
                throw new ShopException(ShopErrorKind.Conflict, $"A {order.Status} order can't be refunded.");
            }

            try
            {
                await new RefundService(_stripe.Client).CreateAsync(
                    new RefundCreateOptions { PaymentIntent = order.StripePaymentIntentId },
                    new RequestOptions { IdempotencyKey = $"hsb-order-{order.Id}-refund" });
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe refund failed for order {OrderId}.", order.Id);
                throw new ShopException(ShopErrorKind.Unavailable, $"Stripe could not refund this order: {ex.StripeError?.Message ?? ex.Message}");
            }

            order.Status = OrderStatus.Refunded;
            order.UpdatedAt = DateTime.UtcNow;
            await _shopRepository.SaveChanges();

            return await GetOrder(id);
        }

        public async Task<ShopSettingsEntity> GetSettings()
        {
            var formats = await _shopRepository.GetFormats();
            var creatorSettings = (await _shopRepository.GetCreatorSettings()).ToDictionary(x => x.Creator, StringComparer.OrdinalIgnoreCase);
            var fileCounts = await _shopRepository.GetCreatorFileCounts(formats.Select(x => x.FilePurpose));

            var creators = fileCounts.Keys
                .Concat(creatorSettings.Keys)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .Select(creator => new ShopCreatorEntity
                {
                    Creator = creator,
                    IsSellable = !creatorSettings.TryGetValue(creator, out var setting) || setting.IsSellable,
                    FileCount = fileCounts.TryGetValue(creator, out var count) ? count : 0,
                })
                .OrderBy(x => x.Creator, StringComparer.OrdinalIgnoreCase)
                .ToList();

            return new ShopSettingsEntity
            {
                StripeConfigured = _settings.StripeConfigured,
                WebhookConfigured = _settings.WebhookConfigured,
                StripeTestMode = _stripe.IsTestMode,
                Formats = formats.Select(x => x.ToShopFormatEntity()).ToList(),
                DiscountTiers = (await _shopRepository.GetDiscountTiers()).Select(x => x.ToShopDiscountTierEntity()).ToList(),
                ShippingOptions = (await _shopRepository.GetShippingOptions(activeOnly: false)).Select(x => x.ToShopShippingOptionEntity()).ToList(),
                Creators = creators,
            };
        }

        /// <summary>
        /// Saves every setting at once. Formats are fixed (they map to card file purposes) and are updated in place;
        /// discount tiers and shipping options are replaced with the submitted lists.
        /// </summary>
        public async Task<ShopSettingsEntity> SaveSettings(ShopSettingsSaveRequest request)
        {
            var errors = new List<string>();

            var formats = (await _shopRepository.GetFormats(track: true)).ToDictionary(x => x.Code);
            foreach (var input in request.Formats ?? new List<ShopFormatSaveRequest>())
            {
                if (!formats.TryGetValue(input.Code, out var format))
                {
                    errors.Add($"Unknown card format \"{input.Code}\".");
                    continue;
                }

                var name = input.Name?.Trim();
                if (string.IsNullOrEmpty(name) || name.Length > 100)
                {
                    errors.Add($"{format.Code}: a name of 1-100 characters is required.");
                }
                if (input.UnitPriceCents <= 0)
                {
                    errors.Add($"{format.Code}: the price must be greater than $0.");
                }
                if (input.TurnaroundMinDays < 0 || input.TurnaroundMaxDays < input.TurnaroundMinDays)
                {
                    errors.Add($"{format.Code}: turnaround days must be 0 or more, with the maximum at least the minimum.");
                }

                format.Name = name ?? format.Name;
                format.Description = string.IsNullOrWhiteSpace(input.Description) ? null : input.Description.Trim();
                format.UnitPriceCents = input.UnitPriceCents;
                format.TurnaroundMinDays = input.TurnaroundMinDays;
                format.TurnaroundMaxDays = input.TurnaroundMaxDays;
                format.IsActive = input.IsActive;
                format.SortOrder = input.SortOrder;
            }

            var tierInputs = request.DiscountTiers ?? new List<ShopDiscountTierSaveRequest>();
            if (tierInputs.Any(x => x.MinQuantity <= 0 || x.PercentOff <= 0 || x.PercentOff >= 100))
            {
                errors.Add("Discount tiers need a minimum quantity above 0 and a percent between 0 and 100.");
            }
            if (tierInputs.GroupBy(x => x.MinQuantity).Any(group => group.Count() > 1))
            {
                errors.Add("Two discount tiers can't have the same minimum quantity.");
            }

            var shippingInputs = request.ShippingOptions ?? new List<ShopShippingOptionSaveRequest>();
            foreach (var input in shippingInputs)
            {
                if (string.IsNullOrWhiteSpace(input.Name) || input.Name.Trim().Length > 100)
                {
                    errors.Add("Each shipping option needs a name of 1-100 characters.");
                }
                if (input.AmountCents < 0 || input.MinBusinessDays <= 0 || input.MaxBusinessDays < input.MinBusinessDays)
                {
                    errors.Add($"Shipping option \"{input.Name}\": the price can't be negative and delivery days must be at least 1, with the maximum at least the minimum.");
                }
            }
            if (shippingInputs.Count(x => x.IsActive) > 5)
            {
                errors.Add("Stripe checkout shows at most 5 shipping options, so no more than 5 can be active.");
            }

            if (errors.Count > 0)
            {
                throw new ShopException(ShopErrorKind.Validation, errors.Distinct().ToArray());
            }

            foreach (var tier in await _shopRepository.GetDiscountTiers(track: true))
            {
                _shopRepository.RemoveDiscountTier(tier);
            }
            foreach (var input in tierInputs.OrderBy(x => x.MinQuantity))
            {
                _shopRepository.AddDiscountTier(new DiscountTier { MinQuantity = input.MinQuantity, PercentOff = Math.Round(input.PercentOff, 2) });
            }

            foreach (var option in await _shopRepository.GetShippingOptions(activeOnly: false, track: true))
            {
                _shopRepository.RemoveShippingOption(option);
            }
            var sortOrder = 0;
            foreach (var input in shippingInputs)
            {
                _shopRepository.AddShippingOption(new ShippingOption
                {
                    Name = input.Name!.Trim(),
                    AmountCents = input.AmountCents,
                    MinBusinessDays = input.MinBusinessDays,
                    MaxBusinessDays = input.MaxBusinessDays,
                    IsActive = input.IsActive,
                    SortOrder = ++sortOrder,
                });
            }

            var creatorSettings = (await _shopRepository.GetCreatorSettings(track: true)).ToDictionary(x => x.Creator, StringComparer.OrdinalIgnoreCase);
            foreach (var input in request.Creators ?? new List<ShopCreatorSaveRequest>())
            {
                if (string.IsNullOrWhiteSpace(input.Creator))
                {
                    continue;
                }
                if (creatorSettings.TryGetValue(input.Creator, out var setting))
                {
                    setting.IsSellable = input.IsSellable;
                }
                else
                {
                    _shopRepository.AddCreatorSetting(new CreatorSetting { Creator = input.Creator.Trim(), IsSellable = input.IsSellable });
                }
            }

            await _shopRepository.SaveChanges();
            return await GetSettings();
        }

        private static string? Clean(string? value, int maxLength, string label, List<string> errors)
        {
            var trimmed = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
            if (trimmed?.Length > maxLength)
            {
                errors.Add($"{label} can be at most {maxLength} characters.");
            }
            return trimmed;
        }

        private static ShopException NotFound()
        {
            return new ShopException(ShopErrorKind.NotFound, "Order not found.");
        }
    }
}
