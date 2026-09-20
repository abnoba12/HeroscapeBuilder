using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    /// <summary>
    /// Battlegroup reads are marked NotCacheable so the owner always sees their latest edits,
    /// share state, and My Army quantities instead of a cached result.
    /// </summary>
    public class BattlegroupRepository
    {
        private readonly HsbDbContext _context;

        public BattlegroupRepository(HsbDbContext context)
        {
            _context = context;
        }

        private IQueryable<Battlegroup> WithUnits()
        {
            return _context.Battlegroups
                .Include(x => x.BattlegroupUnits)
                    .ThenInclude(unit => unit.ArmyCard)
                        .ThenInclude(card => card.SetNavigation)
                .NotCacheable();
        }

        public async Task<List<Battlegroup>> GetAllForUser(string userId)
        {
            return await WithUnits()
                .Where(x => x.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Battlegroup?> GetForUser(string userId, int id, bool track = false)
        {
            var query = WithUnits().Where(x => x.UserId == userId && x.Id == id);
            if (!track)
            {
                query = query.AsNoTracking();
            }
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Battlegroup?> GetShared(Guid shareId)
        {
            return await WithUnits()
                .Where(x => x.ShareId == shareId && x.IsShared)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<bool> NameInUse(string userId, string name, int? excludeId)
        {
            return await _context.Battlegroups
                .NotCacheable()
                .AnyAsync(x => x.UserId == userId && x.Name == name && x.Id != excludeId);
        }

        /// <summary>
        /// Army card id -> quantity the user owns in My Army.
        /// </summary>
        public async Task<Dictionary<int, int>> GetOwnedQuantities(string userId)
        {
            // Summed per card in SQL: My Army can hold more than one row for the same card, and a
            // projection avoids tracked entities returning stale quantities.
            return await _context.UserCards
                .NotCacheable()
                .Where(x => x.UserId == userId)
                .GroupBy(x => x.OwnedArmyCard)
                .Select(group => new { CardId = group.Key, Quantity = group.Sum(x => x.Quantity) })
                .ToDictionaryAsync(x => x.CardId, x => x.Quantity);
        }

        public async Task<List<ArmyCard>> GetArmyCards(IEnumerable<int> ids)
        {
            var idList = ids.ToList();
            return await _context.ArmyCards
                .NotCacheable()
                .Where(x => idList.Contains(x.Id))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<string>> GetCreators()
        {
            return await _context.ArmyCards
                .Select(x => x.Creator)
                .Distinct()
                .ToListAsync();
        }

        public void Add(Battlegroup battlegroup)
        {
            _context.Battlegroups.Add(battlegroup);
        }

        public void Remove(Battlegroup battlegroup)
        {
            _context.Battlegroups.Remove(battlegroup);
        }

        public void AddUnit(BattlegroupUnit unit)
        {
            _context.BattlegroupUnits.Add(unit);
        }

        public void RemoveUnit(BattlegroupUnit unit)
        {
            _context.BattlegroupUnits.Remove(unit);
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
