using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Services
{
    public class UnitService
    {
        private readonly ArmyCardRepository _armyCardRepository;

        public UnitService(ArmyCardRepository armyCardRepository)
        {
            _armyCardRepository = armyCardRepository;
        }

        public async Task<List<UnitEntity>> GetAllUnits()
        {
            // Fetch the ArmyCard entity (EF Core model) from the repository
            var armyCard = await _armyCardRepository.GetAllArmyCards();

            if (armyCard == null)
                throw new ArgumentException("No Units found");

            var unit = armyCard.Select(card => card.ToUnitEntity()).ToList();
            return unit;
        }
    }
}
