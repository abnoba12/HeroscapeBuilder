using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    /// <summary>
    /// Army builder reads are marked NotCacheable so the owner always sees their latest edits,
    /// share state, and My Army quantities instead of a cached result.
    /// </summary>
    public class ArmyBuilderRepository
    {
        private readonly HsbDbContext _context;

        public ArmyBuilderRepository(HsbDbContext context)
        {
            _context = context;
        }

        private IQueryable<ArmyBuilder> WithUnits()
        {
            return _context.ArmyBuilders
                .Include(x => x.ArmyBuilderUnits)
                    .ThenInclude(unit => unit.ArmyCard)
                        .ThenInclude(card => card.SetNavigation)
                .Include(x => x.ArmyBuilderUnits)
                    .ThenInclude(unit => unit.ArmyCard)
                        .ThenInclude(card => card.PointValues)
                .Include(x => x.ArmyBuilderUnits)
                    .ThenInclude(unit => unit.ArmyCard)
                        .ThenInclude(card => card.ArmyCardAbilities)
                .NotCacheable();
        }

        public async Task<List<ArmyBuilder>> GetAllForUser(string userId)
        {
            return await WithUnits()
                .Where(x => x.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ArmyBuilder?> GetForUser(string userId, int id, bool track = false)
        {
            var query = WithUnits().Where(x => x.UserId == userId && x.Id == id);
            if (!track)
            {
                query = query.AsNoTracking();
            }
            return await query.FirstOrDefaultAsync();
        }

        /// <summary>The primary version's id for any of the user's armies or variations; null when it isn't theirs.</summary>
        public async Task<int?> GetArmyId(string userId, int id)
        {
            return await _context.ArmyBuilders
                .NotCacheable()
                .Where(x => x.UserId == userId && x.Id == id)
                .Select(x => (int?)(x.ParentArmyBuilderId ?? x.Id))
                .FirstOrDefaultAsync();
        }

        /// <summary>An army's primary version plus every point variation of it.</summary>
        public async Task<List<ArmyBuilder>> GetArmy(string userId, int armyId, bool track = false)
        {
            var query = WithUnits().Where(x => x.UserId == userId && (x.Id == armyId || x.ParentArmyBuilderId == armyId));
            if (!track)
            {
                query = query.AsNoTracking();
            }
            return await query.ToListAsync();
        }

        /// <summary>Only an army's primary version carries the share link.</summary>
        public async Task<ArmyBuilder?> GetShared(Guid shareId)
        {
            return await WithUnits()
                .Where(x => x.ShareId == shareId && x.IsShared && x.ParentArmyBuilderId == null)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<List<ArmyBuilder>> GetSharedVariations(int armyId)
        {
            return await WithUnits()
                .Where(x => x.ParentArmyBuilderId == armyId)
                .AsNoTracking()
                .ToListAsync();
        }

        /// <summary>Names are unique per user across armies; an army's own variations share its name.</summary>
        public async Task<bool> NameInUse(string userId, string name, int? excludeArmyId)
        {
            return await _context.ArmyBuilders
                .NotCacheable()
                .AnyAsync(x => x.UserId == userId && x.ParentArmyBuilderId == null && x.Name == name && x.Id != excludeArmyId);
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
                .Include(x => x.PointValues)
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

        // ---------- Journal ----------

        public async Task<bool> OwnsArmyBuilder(string userId, int id)
        {
            return await _context.ArmyBuilders
                .NotCacheable()
                .AnyAsync(x => x.UserId == userId && x.Id == id);
        }

        public async Task<List<ArmyBuilderJournalEntry>> GetJournal(int armyBuilderId)
        {
            return await _context.ArmyBuilderJournalEntries
                .NotCacheable()
                .AsNoTracking()
                .Where(x => x.ArmyBuilderId == armyBuilderId)
                .OrderByDescending(x => x.EntryDate)
                .ThenByDescending(x => x.Id)
                .ToListAsync();
        }

        /// <summary>The entry, only if it belongs to one of the user's armies.</summary>
        public async Task<ArmyBuilderJournalEntry?> GetJournalEntry(string userId, int entryId)
        {
            return await _context.ArmyBuilderJournalEntries
                .NotCacheable()
                .FirstOrDefaultAsync(x => x.Id == entryId && x.ArmyBuilder.UserId == userId);
        }

        public void AddJournalEntry(ArmyBuilderJournalEntry entry)
        {
            _context.ArmyBuilderJournalEntries.Add(entry);
        }

        public void RemoveJournalEntry(ArmyBuilderJournalEntry entry)
        {
            _context.ArmyBuilderJournalEntries.Remove(entry);
        }

        public void Add(ArmyBuilder armyBuilder)
        {
            _context.ArmyBuilders.Add(armyBuilder);
        }

        public void Remove(ArmyBuilder armyBuilder)
        {
            _context.ArmyBuilders.Remove(armyBuilder);
        }

        public void AddUnit(ArmyBuilderUnit unit)
        {
            _context.ArmyBuilderUnits.Add(unit);
        }

        public void RemoveUnit(ArmyBuilderUnit unit)
        {
            _context.ArmyBuilderUnits.Remove(unit);
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Runs the work as one transaction. The context retries transient failures, so the transaction has to
        /// run inside its execution strategy.
        /// </summary>
        public async Task InTransaction(Func<Task> work)
        {
            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                await work();
                await transaction.CommitAsync();
            });
        }
    }
}
