using HeroscapeBuilder.Server.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class UserCardRepository
    {
        private readonly HsbDbContext _context;

        public UserCardRepository(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ArmyCard>> GetMyArmyCards(Guid userId)
        {
            return await _context.UserCards
                .Where(x => x.UserId == userId.ToString())
                .Include(x => x.OwnedArmyCardNavigation)
                .Select(x => x.OwnedArmyCardNavigation)
                .ToListAsync();
        }

        public async Task<int> AddUnitsToMyArmy(Guid userId, List<int> unitIds)
        {
            // Group unitIds by their occurrence
            var unitIdGroups = unitIds.GroupBy(id => id)
                                      .ToDictionary(group => group.Key, group => group.Count());

            // Get the IDs from the dictionary
            var ids = unitIdGroups.Keys.ToList();

            // Query the database for matching IDs
            var units = await _context.ArmyCards.Where(x => ids.Contains(x.Id)).ToListAsync();

            foreach (var unit in units)
            {
                _context.UserCards.Add(new UserCard
                {
                    UserId = userId.ToString(),
                    OwnedArmyCard = unit.Id,
                    Quantity = unitIdGroups[unit.Id]
                });
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<int> RemoveUnitsFromMyArmy(Guid userId, List<int> unitIds)
        {
            // Query the items to be removed
            var userCardsToRemove = _context.UserCards
                .Where(x => x.UserId == userId.ToString() && unitIds.Contains(x.OwnedArmyCard))
                .ToList();

            // Remove the items from the DbSet
            _context.UserCards.RemoveRange(userCardsToRemove);

            // Save changes to the database
            return await _context.SaveChangesAsync();
        }
    }
}
