using AutoMapper;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Requests;

namespace HeroscapeBuilder.Server.Services
{
    public class MyArmyService
    {
        private readonly UserCardRepository _userCardRepository;
        private readonly IMapper _mapper;

        public MyArmyService(UserCardRepository userCardRepository, IMapper mapper)
        {
            _userCardRepository = userCardRepository;
            _mapper = mapper;
        }

        public async Task<List<UnitEntity>> GetMyUnits(Guid userId)
        {
            var userCards = await _userCardRepository.GetMyArmyCards(userId);

            if (userCards == null)
                throw new ArgumentException("No Units found");

            var units = userCards
                .Select(card =>
                {
                    var unit = _mapper.Map<UnitEntity>(card.OwnedArmyCardNavigation);
                    unit.Quantity = card.Quantity;
                    return unit;
                })
                .OrderBy(unit => unit.Name)
                .ToList();

            return units;
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
