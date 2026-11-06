using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    public class MyArmyService
    {
        private readonly UserCardRepository _userCardRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public MyArmyService(UserCardRepository userCardRepository, UserManager<ApplicationUser> userManager)
        {
            _userCardRepository = userCardRepository;
            _userManager = userManager;
        }

        public async Task<CollectionShareEntity> GetCollectionShare(Guid userId)
        {
            return ToShare(await FindUser(userId));
        }

        public async Task<CollectionShareEntity> SetCollectionShared(Guid userId, bool isShared)
        {
            var user = await FindUser(userId);
            user.CollectionIsShared = isShared;
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                throw new ArgumentException(string.Join(" ", result.Errors.Select(e => e.Description)));
            return ToShare(user);
        }

        /// <summary>
        /// Public lookup. Only collections that are currently shared resolve; null otherwise.
        /// </summary>
        public async Task<List<UnitEntity>?> GetSharedCollection(Guid shareId)
        {
            var owner = await _userManager.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.CollectionShareId == shareId && x.CollectionIsShared);
            return owner == null ? null : await GetMyUnits(Guid.Parse(owner.Id));
        }

        private async Task<ApplicationUser> FindUser(Guid userId)
        {
            return await _userManager.FindByIdAsync(userId.ToString())
                ?? throw new ArgumentException("Account not found.");
        }

        private static CollectionShareEntity ToShare(ApplicationUser user) => new()
        {
            IsShared = user.CollectionIsShared,
            ShareId = user.CollectionShareId,
        };

        public async Task<List<UnitEntity>> GetMyUnits(Guid userId)
        {
            var userCards = await _userCardRepository.GetMyArmyCards(userId);

            if (userCards == null)
                throw new ArgumentException("No Units found");

            var units = userCards
                .Select(card =>
                {
                    var unit = card.OwnedArmyCardNavigation.ToUnitEntity();
                    unit.Quantity = card.Quantity;
                    return unit;
                })
                .OrderBy(unit => unit.Name)
                .ToList();

            return units;
        }

        public async Task<int> GetMyUnitCount(Guid userId)
        {
            return await _userCardRepository.GetMyArmyCount(userId);
        }

        public async Task<int> AddUnitsToMyArmy(Guid userId, List<int> unitIds)
        {
            if (await _userCardRepository.AddUnitsToMyArmy(userId, unitIds) != unitIds.Count)
            {
                throw new ArgumentException("Unable to add all units");
            }
            return unitIds.Count;
        }

        public async Task<int> RemoveUnitsFromMyArmy(Guid userId, List<int> unitIds)
        {
            if (await _userCardRepository.RemoveUnitsFromMyArmy(userId, unitIds) != unitIds.Count)
            {
                throw new ArgumentException("Unable to remove units");
            }
            return unitIds.Count;
        }

        public async Task<int> SetMyUnits(Guid userId, List<MyArmyUpdateRequest> units)
        {
            return await _userCardRepository.SetMyArmy(userId, units);
        }
    }
}
