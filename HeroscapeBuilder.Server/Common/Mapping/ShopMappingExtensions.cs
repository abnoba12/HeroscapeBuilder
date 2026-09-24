using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Shop;

namespace HeroscapeBuilder.Server.Common.Mapping
{
    /// <summary>
    /// Maps the shop tables to the models returned by the API.
    /// </summary>
    public static class ShopMappingExtensions
    {
        public static ShopFormatEntity ToShopFormatEntity(this CardFormat source)
        {
            return new ShopFormatEntity
            {
                Code = source.Code,
                Name = source.Name,
                Description = source.Description,
                FilePurpose = source.FilePurpose,
                UnitPriceCents = source.UnitPriceCents,
                TurnaroundMinDays = source.TurnaroundMinDays,
                TurnaroundMaxDays = source.TurnaroundMaxDays,
                IsActive = source.IsActive,
                SortOrder = source.SortOrder,
            };
        }

        public static ShopDiscountTierEntity ToShopDiscountTierEntity(this DiscountTier source)
        {
            return new ShopDiscountTierEntity
            {
                MinQuantity = source.MinQuantity,
                PercentOff = source.PercentOff,
            };
        }

        public static ShopShippingOptionEntity ToShopShippingOptionEntity(this ShippingOption source)
        {
            return new ShopShippingOptionEntity
            {
                Id = source.Id,
                Name = source.Name,
                AmountCents = source.AmountCents,
                MinBusinessDays = source.MinBusinessDays,
                MaxBusinessDays = source.MaxBusinessDays,
                IsActive = source.IsActive,
            };
        }

        public static ShopStoreStatusEntity ToShopStoreStatusEntity(this StoreStatus source)
        {
            return new ShopStoreStatusEntity
            {
                IsOpen = source.IsOpen,
                ClosedMessage = source.ClosedMessage,
                ReopensOn = source.ReopensOn,
                UpdatedAt = AsUtc(source.UpdatedAt),
            };
        }

        public static ShopOrderSummaryEntity ToShopOrderSummaryEntity(this CustomerOrder source)
        {
            return new ShopOrderSummaryEntity
            {
                Id = source.Id,
                OrderNumber = OrderStatus.FormatNumber(source.Id),
                AccessKey = source.AccessKey,
                Status = source.Status,
                CreatedAt = AsUtc(source.CreatedAt),
                PaidAt = AsUtc(source.PaidAt),
                CardCount = source.CardCount,
                TotalCents = source.TotalCents,
                CustomerName = source.CustomerName ?? source.ShipName,
                Email = source.Email,
                OwnerNotified = source.OwnerNotifiedAt != null,
            };
        }

        /// <summary>
        /// Customer view. <paramref name="formats"/> supplies the current turnaround estimates by format code.
        /// </summary>
        public static ShopOrderEntity ToShopOrderEntity(this CustomerOrder source, IReadOnlyDictionary<string, CardFormat> formats)
        {
            var dest = new ShopOrderEntity();
            Fill(dest, source, formats);
            return dest;
        }

        public static ShopAdminOrderEntity ToShopAdminOrderEntity(this CustomerOrder source, IReadOnlyDictionary<string, CardFormat> formats)
        {
            var dest = new ShopAdminOrderEntity
            {
                Id = source.Id,
                CustomerName = source.CustomerName,
                Phone = source.Phone,
                AccountEmail = source.User?.Email,
                AdminNotes = source.AdminNotes,
                StripePaymentIntentId = source.StripePaymentIntentId,
                StripeCheckoutSessionId = source.StripeCheckoutSessionId,
                UpdatedAt = AsUtc(source.UpdatedAt),
                OwnerNotifiedAt = AsUtc(source.OwnerNotifiedAt),
                Formats = source.OrderItems
                    .GroupBy(x => new { x.FormatCode, x.FormatName })
                    .Select(group => new ShopQuoteFormatEntity
                    {
                        FormatCode = group.Key.FormatCode,
                        FormatName = group.Key.FormatName,
                        Quantity = group.Sum(x => x.Quantity),
                        SubtotalCents = group.Sum(x => x.Quantity * x.UnitPriceCents),
                        UnitPriceCents = group.First().UnitPriceCents,
                    })
                    .OrderBy(x => formats.TryGetValue(x.FormatCode, out var format) ? format.SortOrder : int.MaxValue)
                    .ToList(),
            };
            Fill(dest, source, formats);
            return dest;
        }

        // Order times are stored in UTC; marking them so lets the JSON carry a "Z" and browsers show local time.
        private static DateTime AsUtc(DateTime value) => DateTime.SpecifyKind(value, DateTimeKind.Utc);

        private static DateTime? AsUtc(DateTime? value) => value.HasValue ? AsUtc(value.Value) : null;

        private static void Fill(ShopOrderEntity dest, CustomerOrder source, IReadOnlyDictionary<string, CardFormat> formats)
        {
            dest.OrderNumber = OrderStatus.FormatNumber(source.Id);
            dest.AccessKey = source.AccessKey;
            dest.Status = source.Status;
            dest.CreatedAt = AsUtc(source.CreatedAt);
            dest.PaidAt = AsUtc(source.PaidAt);
            dest.ShippedAt = AsUtc(source.ShippedAt);
            dest.CardCount = source.CardCount;
            dest.SubtotalCents = source.SubtotalCents;
            dest.DiscountPercent = source.DiscountPercent;
            dest.DiscountCents = source.DiscountCents;
            dest.ShippingCents = source.ShippingCents;
            dest.TaxCents = source.TaxCents;
            dest.TotalCents = source.TotalCents;
            dest.Email = source.Email;
            dest.ShippingMethod = source.ShippingMethod;
            dest.Carrier = source.Carrier;
            dest.TrackingNumber = source.TrackingNumber;
            dest.ShipTo = source.ShipLine1 == null ? null : new ShopAddressEntity
            {
                Name = source.ShipName,
                Line1 = source.ShipLine1,
                Line2 = source.ShipLine2,
                City = source.ShipCity,
                State = source.ShipState,
                PostalCode = source.ShipPostalCode,
                Country = source.ShipCountry,
            };

            var orderFormats = source.OrderItems
                .Select(x => formats.TryGetValue(x.FormatCode, out var format) ? format : null)
                .Where(x => x != null)
                .ToList();
            dest.TurnaroundMinDays = orderFormats.Count > 0 ? orderFormats.Max(x => x!.TurnaroundMinDays) : 0;
            dest.TurnaroundMaxDays = orderFormats.Count > 0 ? orderFormats.Max(x => x!.TurnaroundMaxDays) : 0;

            dest.Items = source.OrderItems
                .OrderBy(x => formats.TryGetValue(x.FormatCode, out var format) ? format.SortOrder : int.MaxValue)
                .ThenBy(x => x.UnitName, StringComparer.OrdinalIgnoreCase)
                .Select(x => new ShopOrderItemEntity
                {
                    ArmyCardFileId = x.ArmyCardFileId,
                    ArmyCardId = x.ArmyCardId,
                    UnitName = x.UnitName,
                    Creator = x.Creator,
                    FormatCode = x.FormatCode,
                    FormatName = x.FormatName,
                    FilePath = x.FilePath.PrependFilePath(),
                    Quantity = x.Quantity,
                    UnitPriceCents = x.UnitPriceCents,
                    LineTotalCents = x.Quantity * x.UnitPriceCents,
                })
                .ToList();
        }
    }
}
