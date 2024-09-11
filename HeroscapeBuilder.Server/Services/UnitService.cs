using AutoMapper;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Services
{
    public class UnitService
    {
        private readonly ArmyCardRepository _armyCardRepository;
        private readonly IMapper _mapper;

        public UnitService(ArmyCardRepository armyCardRepository, IMapper mapper)
        {
            _armyCardRepository = armyCardRepository;
            _mapper = mapper;
        }

        public async Task<List<UnitEntity>> GetAllUnits()
        {
            // Fetch the ArmyCard entity (EF Core model) from the repository
            var armyCard = await _armyCardRepository.GetAllArmyCards();

            if (armyCard == null)
                throw new ArgumentException("No Units found");

            var unit = _mapper.Map<List<UnitEntity>>(armyCard);
            return unit;
        }
    }
}
