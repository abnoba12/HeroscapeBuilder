using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    /// <summary>
    /// Data access for the card shop (the "shop" schema). Every shop read is NotCacheable: prices must be current
    /// when a customer checks out, and order status changes come from Stripe webhooks at any time.
    /// </summary>
    public class ShopRepository
    {
        private readonly HsbDbContext _context;

        public ShopRepository(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<List<CardFormat>> GetFormats(bool track = false)
        {
            var query = _context.CardFormats.NotCacheable().OrderBy(x => x.SortOrder).ThenBy(x => x.Name).AsQueryable();
            return await (track ? query : query.AsNoTracking()).ToListAsync();
        }

        public async Task<List<DiscountTier>> GetDiscountTiers(bool track = false)
        {
            var query = _context.DiscountTiers.NotCacheable().OrderBy(x => x.MinQuantity).AsQueryable();
            return await (track ? query : query.AsNoTracking()).ToListAsync();
        }

        public async Task<List<ShippingOption>> GetShippingOptions(bool activeOnly, bool track = false)
        {
            var query = _context.ShippingOptions.NotCacheable().AsQueryable();
            if (activeOnly)
            {
                query = query.Where(x => x.IsActive);
            }
            query = query.OrderBy(x => x.SortOrder).ThenBy(x => x.AmountCents);
            return await (track ? query : query.AsNoTracking()).ToListAsync();
        }

        public async Task<List<CreatorSetting>> GetCreatorSettings(bool track = false)
        {
            var query = _context.CreatorSettings.NotCacheable().AsQueryable();
            return await (track ? query : query.AsNoTracking()).ToListAsync();
        }

        /// <summary>
        /// Card files with the given purposes, with their unit and thumbnail children.
        /// </summary>
        public async Task<List<ArmyCardFile>> GetCardFiles(IEnumerable<string> purposes)
        {
            var purposeList = purposes.ToList();
            return await _context.ArmyCardFiles
                .Include(x => x.ArmyCard)
                .Include(x => x.InverseParentNavigation)
                .Where(x => purposeList.Contains(x.FilePurpose))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<ArmyCardFile>> GetCardFiles(IEnumerable<long> ids)
        {
            var idList = ids.ToList();
            return await _context.ArmyCardFiles
                .Include(x => x.ArmyCard)
                .Include(x => x.InverseParentNavigation)
                .Where(x => idList.Contains(x.Id))
                .NotCacheable()
                .AsNoTracking()
                .ToListAsync();
        }

        /// <summary>
        /// Creator -> number of card files in the given purposes.
        /// </summary>
        public async Task<Dictionary<string, int>> GetCreatorFileCounts(IEnumerable<string> purposes)
        {
            var purposeList = purposes.ToList();
            return await _context.ArmyCardFiles
                .Where(x => purposeList.Contains(x.FilePurpose))
                .GroupBy(x => x.ArmyCard.Creator)
                .Select(group => new { Creator = group.Key, Count = group.Count() })
                .ToDictionaryAsync(x => x.Creator, x => x.Count);
        }

        private IQueryable<CustomerOrder> Orders(bool track)
        {
            var query = _context.CustomerOrders
                .Include(x => x.OrderItems)
                .Include(x => x.User)
                .NotCacheable();
            return track ? query : query.AsNoTracking();
        }

        public Task<CustomerOrder?> GetOrder(int id, bool track = false)
        {
            return Orders(track).FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<CustomerOrder?> GetOrderByAccessKey(Guid accessKey)
        {
            return Orders(false).FirstOrDefaultAsync(x => x.AccessKey == accessKey);
        }

        public Task<CustomerOrder?> GetOrderByCheckoutSession(string sessionId, bool track = false)
        {
            return Orders(track).FirstOrDefaultAsync(x => x.StripeCheckoutSessionId == sessionId);
        }

        public Task<CustomerOrder?> GetOrderByPaymentIntent(string paymentIntentId, bool track = false)
        {
            return Orders(track).FirstOrDefaultAsync(x => x.StripePaymentIntentId == paymentIntentId);
        }

        public async Task<List<CustomerOrder>> GetOrdersForUser(string userId, IEnumerable<string> statuses)
        {
            var statusList = statuses.ToList();
            return await _context.CustomerOrders
                .NotCacheable()
                .Where(x => x.UserId == userId && statusList.Contains(x.Status))
                .OrderByDescending(x => x.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<CustomerOrder>> GetOrders(IEnumerable<string> statuses)
        {
            var statusList = statuses.ToList();
            return await _context.CustomerOrders
                .NotCacheable()
                .Where(x => statusList.Contains(x.Status))
                .OrderByDescending(x => x.PaidAt ?? x.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        /// <summary>
        /// The single store status row. A missing row (script not run) counts as closed.
        /// </summary>
        public async Task<StoreStatus> GetStoreStatus(bool track = false)
        {
            var query = _context.StoreStatuses.NotCacheable().Where(x => x.Id == 1);
            var status = await (track ? query : query.AsNoTracking()).FirstOrDefaultAsync();
            if (status == null)
            {
                status = new StoreStatus { Id = 1, IsOpen = false, ClosedMessage = "The card shop is not set up yet.", UpdatedAt = DateTime.UtcNow };
                if (track)
                {
                    _context.StoreStatuses.Add(status);
                }
            }
            return status;
        }

        /// <summary>
        /// Unpaid checkouts started since <paramref name="since"/>, oldest first.
        /// </summary>
        public async Task<List<CustomerOrder>> GetPendingOrders(DateTime since)
        {
            return await _context.CustomerOrders
                .NotCacheable()
                .Where(x => x.Status == Domain.Shop.OrderStatus.Pending && x.CreatedAt >= since)
                .OrderBy(x => x.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        /// <summary>
        /// Paid orders whose "new order" email has not reached the owner yet.
        /// </summary>
        public async Task<List<int>> GetOrderIdsAwaitingNotification()
        {
            return await _context.CustomerOrders
                .NotCacheable()
                .Where(x => x.OwnerNotifiedAt == null && x.PaidAt != null)
                .OrderBy(x => x.PaidAt)
                .Select(x => x.Id)
                .ToListAsync();
        }

        public async Task<bool> EventProcessed(string eventId)
        {
            return await _context.StripeEvents.NotCacheable().AnyAsync(x => x.EventId == eventId);
        }

        public void AddEvent(StripeEvent stripeEvent)
        {
            _context.StripeEvents.Add(stripeEvent);
        }

        public void AddOrder(CustomerOrder order)
        {
            _context.CustomerOrders.Add(order);
        }

        public void RemoveOrder(CustomerOrder order)
        {
            _context.CustomerOrders.Remove(order);
        }

        public void AddDiscountTier(DiscountTier tier)
        {
            _context.DiscountTiers.Add(tier);
        }

        public void RemoveDiscountTier(DiscountTier tier)
        {
            _context.DiscountTiers.Remove(tier);
        }

        public void AddShippingOption(ShippingOption option)
        {
            _context.ShippingOptions.Add(option);
        }

        public void RemoveShippingOption(ShippingOption option)
        {
            _context.ShippingOptions.Remove(option);
        }

        public void AddCreatorSetting(CreatorSetting setting)
        {
            _context.CreatorSettings.Add(setting);
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
