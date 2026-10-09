using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class UserTerrainRepository
    {
        private readonly HsbDbContext _context;

        public UserTerrainRepository(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserTerrainRequest>> GetForUser(Guid userId)
        {
            var id = userId.ToString();
            return await _context.UserTerrains
                .NotCacheable()
                .AsNoTracking()
                .Where(x => x.UserId == id)
                .Select(x => new UserTerrainRequest
                {
                    TerrainTypeId = x.TerrainTypeId,
                    TerrainSizeId = x.TerrainSizeId,
                    Quantity = x.Quantity
                })
                .ToListAsync();
        }

        /// <summary>Replaces the user's terrain with the desired set; rows with no quantity are dropped.</summary>
        public async Task<int> SetForUser(Guid userId, List<UserTerrainRequest> terrain)
        {
            var id = userId.ToString();
            var desired = terrain
                .Where(x => x.Quantity > 0)
                .GroupBy(x => (x.TerrainTypeId, x.TerrainSizeId))
                .ToDictionary(g => g.Key, g => g.First().Quantity);

            var existing = await _context.UserTerrains.Where(x => x.UserId == id).ToListAsync();

            foreach (var row in existing)
            {
                if (desired.Remove((row.TerrainTypeId, row.TerrainSizeId), out var quantity))
                {
                    row.Quantity = quantity;
                }
                else
                {
                    _context.UserTerrains.Remove(row);
                }
            }

            foreach (var ((typeId, sizeId), quantity) in desired)
            {
                _context.UserTerrains.Add(new UserTerrain
                {
                    UserId = id,
                    TerrainTypeId = typeId,
                    TerrainSizeId = sizeId,
                    Quantity = quantity
                });
            }

            return await _context.SaveChangesAsync();
        }
    }
}
