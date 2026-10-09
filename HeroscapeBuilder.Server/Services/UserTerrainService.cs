using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Requests;

namespace HeroscapeBuilder.Server.Services
{
    public class UserTerrainService
    {
        private readonly UserTerrainRepository _repository;
        private readonly MapRepository _mapRepository;

        public UserTerrainService(UserTerrainRepository repository, MapRepository mapRepository)
        {
            _repository = repository;
            _mapRepository = mapRepository;
        }

        public Task<List<UserTerrainRequest>> GetMyTerrain(Guid userId) => _repository.GetForUser(userId);

        public async Task<List<UserTerrainRequest>> SetMyTerrain(Guid userId, List<UserTerrainRequest> terrain)
        {
            var options = await _mapRepository.GetOptions();
            var typeIds = options.TerrainTypes.Select(t => t.Id).ToHashSet();
            var sizeIds = options.TerrainSizes.Select(s => s.Id).ToHashSet();

            if (terrain.Any(t => t.Quantity < 0 || t.Quantity > 10000
                                 || !typeIds.Contains(t.TerrainTypeId) || !sizeIds.Contains(t.TerrainSizeId)))
            {
                throw new ArgumentException("Invalid terrain type, size or quantity.");
            }

            await _repository.SetForUser(userId, terrain);
            return await _repository.GetForUser(userId);
        }
    }
}
