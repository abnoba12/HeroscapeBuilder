using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    public class MapRepository
    {
        private readonly HsbDbContext _context;

        public MapRepository(HsbDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lookups are NotCacheable: new terrain types and sizes are added with plain SQL, and the admin
        /// should see them on the next page load rather than after the EF cache expires.
        /// </summary>
        public async Task<MapOptionsEntity> GetOptions()
        {
            var allowedSizes = await GetAllowedSizeIds();

            var options = new MapOptionsEntity
            {
                // creator.id is BIGINT in prod but INT in some databases, and SqlClient won't read an int as a long,
                // so the cast happens in SQL rather than relying on the entity's type.
                Creators = await _context.Database
                    .SqlQuery<MapCreatorOption>($"SELECT CAST(id AS bigint) AS Id, name AS Name FROM dbo.creator ORDER BY name")
                    .ToListAsync(),
                TerrainTypes = await _context.TerrainTypes.NotCacheable().AsNoTracking()
                    .OrderBy(t => t.Name)
                    .Select(t => new MapTerrainTypeOption { Id = t.Id, Name = t.Name, SwapGroup = t.SwapGroup, SingleSwapGroup = t.SingleSwapGroup })
                    .ToListAsync(),
                TerrainSizes = await _context.TerrainSizes.NotCacheable().AsNoTracking()
                    .OrderBy(s => s.Spaces)
                    .Select(s => new MapTerrainSizeOption { Id = s.Id, Name = s.Name, Spaces = s.Spaces })
                    .ToListAsync(),
            };

            foreach (var type in options.TerrainTypes)
            {
                if (allowedSizes.TryGetValue(type.Id, out var sizeIds)) type.AllowedSizeIds = sizeIds.OrderBy(id => id).ToList();
            }

            return options;
        }

        /// <summary>Sizes each restricted terrain type comes in. Types missing from the result are allowed in every size.</summary>
        public async Task<Dictionary<int, HashSet<int>>> GetAllowedSizeIds()
        {
            var rows = await _context.TerrainTypeSizes.NotCacheable().AsNoTracking().ToListAsync();
            return rows
                .GroupBy(r => r.TerrainTypeId)
                .ToDictionary(g => g.Key, g => g.Select(r => r.TerrainSizeId).ToHashSet());
        }

        public Task<bool> CreatorExists(long creatorId) =>
            _context.Creators.NotCacheable().AnyAsync(c => c.Id == creatorId);

        public async Task<HashSet<int>> GetTerrainTypeIds() =>
            (await _context.TerrainTypes.NotCacheable().AsNoTracking().Select(t => t.Id).ToListAsync()).ToHashSet();

        public async Task<HashSet<int>> GetTerrainSizeIds() =>
            (await _context.TerrainSizes.NotCacheable().AsNoTracking().Select(s => s.Id).ToListAsync()).ToHashSet();

        /// <summary>Saves the map and its tiles in a single SaveChanges, so either everything is stored or nothing is.</summary>
        public async Task<Map> AddMap(Map map)
        {
            _context.Maps.Add(map);
            await _context.SaveChangesAsync();
            return map;
        }

        /// <summary>Every map with its creator and tiles, newest first. Not cached so an edit or delete shows up immediately.</summary>
        public Task<List<MapEntity>> GetMaps() => ProjectMaps(_context.Maps.NotCacheable().AsNoTracking())
            .OrderByDescending(m => m.CreatedAt)
            .ThenBy(m => m.Name)
            .ToListAsync();

        public Task<MapEntity?> GetMapEntity(int id) => ProjectMaps(_context.Maps.NotCacheable().AsNoTracking().Where(m => m.Id == id))
            .FirstOrDefaultAsync();

        private static IQueryable<MapEntity> ProjectMaps(IQueryable<Map> maps) => maps.Select(m => new MapEntity
        {
            Id = m.Id,
            Name = m.Name,
            CreatorId = m.CreatorId,
            CreatorName = m.Creator != null ? m.Creator.Name : null,
            CreatorAbbreviation = m.Creator != null ? m.Creator.Abbreviation : null,
            CustomerName = m.CustomerName,
            PlayerCount = m.PlayerCount,
            RawFilePath = m.FilePath,
            RawThumbnailPath = m.ThumbnailPath,
            CreatedAt = m.CreatedAt,
            Tiles = m.Tiles.Select(t => new MapTileEntity
            {
                TerrainTypeId = t.TerrainTypeId,
                TerrainSizeId = t.TerrainSizeId,
                Spaces = t.TerrainSize.Spaces,
                Quantity = t.Quantity
            }).ToList()
        });

        /// <summary>The tracked map with its tiles, for editing or deleting.</summary>
        public Task<Map?> GetMapForUpdate(int id) =>
            _context.Maps.NotCacheable().Include(m => m.Tiles).FirstOrDefaultAsync(m => m.Id == id);

        /// <summary>
        /// Applies the edit and makes the stored tiles match <paramref name="tiles"/>. Existing rows are updated in
        /// place (rather than deleted and re-added) so a repeated type/size never trips the unique index.
        /// </summary>
        public async Task UpdateMap(Map map, IReadOnlyCollection<MapTile> tiles)
        {
            var wanted = tiles.ToDictionary(t => (t.TerrainTypeId, t.TerrainSizeId));

            foreach (var existing in map.Tiles.ToList())
            {
                if (wanted.TryGetValue((existing.TerrainTypeId, existing.TerrainSizeId), out var tile))
                {
                    existing.Quantity = tile.Quantity;
                    wanted.Remove((existing.TerrainTypeId, existing.TerrainSizeId));
                }
                else
                {
                    _context.MapTiles.Remove(existing);
                }
            }

            foreach (var tile in wanted.Values) map.Tiles.Add(tile);

            await _context.SaveChangesAsync();
        }

        /// <summary>Deletes the map; its tiles go with it through the foreign key's cascade.</summary>
        public async Task DeleteMap(Map map)
        {
            _context.Maps.Remove(map);
            await _context.SaveChangesAsync();
        }
    }
}
