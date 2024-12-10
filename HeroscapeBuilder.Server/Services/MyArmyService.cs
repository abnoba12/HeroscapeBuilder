using AutoMapper;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;

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
            // Fetch the ArmyCard entity (EF Core model) from the repository
            var armyCard = await _userCardRepository.GetMyArmyCards(userId);

            if (armyCard == null)
                throw new ArgumentException("No Units found");

            var unit = _mapper.Map<List<UnitEntity>>(armyCard);
            return unit;
        }

        public async Task<int> AddUnitsToMyArmy(Guid userId, List<int> unitIds)
        {
            if(await _userCardRepository.AddUnitsToMyArmy(userId, unitIds) != unitIds.Count)
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
    }
}
