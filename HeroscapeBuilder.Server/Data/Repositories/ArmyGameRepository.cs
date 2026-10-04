using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    /// <summary>Game results change as users log them, so every read is NotCacheable.</summary>
    public class ArmyGameRepository
    {
        private readonly HsbDbContext _context;

        public ArmyGameRepository(HsbDbContext context)
        {
            _context = context;
        }

        /// <summary>Army id -> (wins, losses) for the user's armies.</summary>
        public async Task<Dictionary<int, (int Wins, int Losses)>> GetTallies(string userId)
        {
            var rows = await _context.ArmyGames
                .NotCacheable()
                .Where(x => x.UserId == userId && x.BattlegroupId != null)
                .GroupBy(x => x.BattlegroupId!.Value)
                .Select(group => new
                {
                    BattlegroupId = group.Key,
                    Wins = group.Count(x => x.Won),
                    Losses = group.Count(x => !x.Won),
                })
                .ToListAsync();

            return rows.ToDictionary(x => x.BattlegroupId, x => (x.Wins, x.Losses));
        }

        public async Task<List<ArmyGame>> GetRecent(string userId, int battlegroupId, int take)
        {
            return await _context.ArmyGames
                .NotCacheable()
                .AsNoTracking()
                .Where(x => x.UserId == userId && x.BattlegroupId == battlegroupId)
                .OrderByDescending(x => x.PlayedAt)
                .ThenByDescending(x => x.Id)
                .Take(take)
                .ToListAsync();
        }

        public async Task<ArmyGame?> GetOwned(string userId, int gameId)
        {
            return await _context.ArmyGames
                .NotCacheable()
                .FirstOrDefaultAsync(x => x.UserId == userId && x.Id == gameId);
        }

        public async Task<int> CountForUser(string userId)
        {
            return await _context.ArmyGames.NotCacheable().CountAsync(x => x.UserId == userId);
        }

        public void Add(ArmyGame game)
        {
            _context.ArmyGames.Add(game);
        }

        public void Remove(ArmyGame game)
        {
            _context.ArmyGames.Remove(game);
        }

        /// <summary>
        /// Keeps the results of an army that is being deleted by unlinking them from it (see ArmyGames.sql for why
        /// the database does not do this itself).
        /// </summary>
        public async Task DetachFromBattlegroup(string userId, int battlegroupId)
        {
            await _context.ArmyGames
                .Where(x => x.UserId == userId && x.BattlegroupId == battlegroupId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.BattlegroupId, (int?)null));
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }

        // ---------- For the power rating ----------

        public async Task<List<GameUnitRow>> GetAllGameUnits()
        {
            return await _context.ArmyGameUnits
                .NotCacheable()
                .AsNoTracking()
                .Select(x => new GameUnitRow(x.ArmyGame.UserId, x.ArmyGameId, x.ArmyGame.Won, x.ArmyCardId, x.Quantity, x.Points))
                .ToListAsync();
        }

        public async Task<DateTime?> GetLatestGameTime()
        {
            return await _context.ArmyGames.NotCacheable().MaxAsync(x => (DateTime?)x.CreatedAt);
        }
    }
}
