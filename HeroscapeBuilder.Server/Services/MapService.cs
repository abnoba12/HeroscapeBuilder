using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Integrations.Interfaces;
using Newtonsoft.Json;

namespace HeroscapeBuilder.Server.Services
{
    public class MapService
    {
        /// <summary>Name of the MinIO bucket that holds map PDFs, with thumbnails in its thumbs folder.</summary>
        private const string MapsBucket = "map";
        private const int MaxNameLength = 200;
        private const int MaxPlayers = 99;
        private const int ThumbnailMaxWidth = 600;
        private const int ThumbnailMaxHeight = 600;

        private readonly MapRepository _mapRepository;
        private readonly IFileStorage<byte[]> _blobStorage;
        private readonly PdfService _pdfService;
        private readonly ImageService _imageService;

        public MapService(MapRepository mapRepository, IFileStorage<byte[]> blobStorage, PdfService pdfService, ImageService imageService)
        {
            _mapRepository = mapRepository;
            _blobStorage = blobStorage;
            _pdfService = pdfService;
            _imageService = imageService;
        }

        public Task<MapOptionsEntity> GetOptions() => _mapRepository.GetOptions();

        public async Task<MapEntity> AddMap(MapUploadRequest request)
        {
            var valid = await Validate(request, filesRequired: true);

            var (filePath, thumbnailPath) = NewPaths(valid.Name);
            await StoreFiles(valid.FileData!, filePath, valid.ThumbnailData!, thumbnailPath);

            try
            {
                var map = await _mapRepository.AddMap(new Map
                {
                    Name = valid.Name,
                    CreatorId = valid.CreatorId,
                    CustomerName = valid.CustomerName,
                    PlayerCount = request.PlayerCount,
                    FilePath = filePath,
                    ThumbnailPath = thumbnailPath,
                    Tiles = valid.Tiles.Select(ToTile).ToList()
                });

                return (await _mapRepository.GetMapEntity(map.Id))!;
            }
            catch
            {
                // Don't leave orphaned files in storage when the database save fails.
                await DeleteQuietly(filePath);
                await DeleteQuietly(thumbnailPath);
                throw;
            }
        }

        public Task<List<MapEntity>> GetMaps() => _mapRepository.GetMaps();

        public Task<MapEntity?> GetMap(int id) => _mapRepository.GetMapEntity(id);

        /// <summary>Returns null when the map doesn't exist. A PDF or thumbnail that isn't supplied is left as it was.</summary>
        public async Task<MapEntity?> UpdateMap(int id, MapUploadRequest request)
        {
            var map = await _mapRepository.GetMapForUpdate(id);
            if (map == null) return null;

            var valid = await Validate(request, filesRequired: false);

            var oldFilePath = map.FilePath;
            var oldThumbnailPath = map.ThumbnailPath;
            var newFilePath = oldFilePath;
            var newThumbnailPath = oldThumbnailPath;
            var uploaded = new List<string>();

            try
            {
                // New files get new names (the old ones stay in place until the save succeeds), so a failed edit
                // never leaves the map pointing at a half-replaced file.
                var paths = NewPaths(valid.Name);
                if (valid.FileData != null)
                {
                    newFilePath = paths.FilePath;
                    await _blobStorage.UploadAsync(valid.FileData, newFilePath);
                    uploaded.Add(newFilePath);
                }

                if (valid.ThumbnailData != null)
                {
                    newThumbnailPath = paths.ThumbnailPath;
                    await _blobStorage.UploadAsync(valid.ThumbnailData, newThumbnailPath);
                    uploaded.Add(newThumbnailPath);
                }

                map.Name = valid.Name;
                map.CreatorId = valid.CreatorId;
                map.CustomerName = valid.CustomerName;
                map.PlayerCount = request.PlayerCount;
                map.FilePath = newFilePath;
                map.ThumbnailPath = newThumbnailPath;

                await _mapRepository.UpdateMap(map, valid.Tiles.Select(ToTile).ToList());
            }
            catch
            {
                foreach (var path in uploaded) await DeleteQuietly(path);
                throw;
            }

            if (newFilePath != oldFilePath) await DeleteQuietly(oldFilePath);
            if (newThumbnailPath != oldThumbnailPath) await DeleteQuietly(oldThumbnailPath);

            return await _mapRepository.GetMapEntity(id);
        }

        /// <summary>Returns false when the map doesn't exist. The row goes first; stored files are removed best-effort afterwards.</summary>
        public async Task<bool> DeleteMap(int id)
        {
            var map = await _mapRepository.GetMapForUpdate(id);
            if (map == null) return false;

            var filePath = map.FilePath;
            var thumbnailPath = map.ThumbnailPath;

            await _mapRepository.DeleteMap(map);

            await DeleteQuietly(filePath);
            await DeleteQuietly(thumbnailPath);
            return true;
        }

        private sealed class ValidatedMap
        {
            public string Name { get; init; } = null!;
            public long? CreatorId { get; init; }
            public string? CustomerName { get; init; }
            public List<MapTileRequest> Tiles { get; init; } = new();
            public byte[]? FileData { get; init; }
            public byte[]? ThumbnailData { get; init; }
        }

        /// <summary>Checks the form and reads its files, throwing a <see cref="MapException"/> listing every problem found.</summary>
        private async Task<ValidatedMap> Validate(MapUploadRequest request, bool filesRequired)
        {
            var errors = new List<string>();

            var name = request.Name?.Trim();
            if (string.IsNullOrEmpty(name)) errors.Add("Map name is required.");
            else if (name.Length > MaxNameLength) errors.Add($"Map name must be {MaxNameLength} characters or fewer.");

            // A map belongs to a known creator or to a custom author, never both. Custom authors are free text and
            // are deliberately not added to the creator table.
            var customerName = request.CustomerName?.Trim();
            var creatorId = request.CreatorId;
            if (creatorId.HasValue)
            {
                customerName = null;
                if (!await _mapRepository.CreatorExists(creatorId.Value)) errors.Add("Map creator was not found.");
            }
            else if (string.IsNullOrEmpty(customerName))
            {
                errors.Add("Select a map creator, or enter an author's name.");
            }
            else if (customerName.Length > MaxNameLength)
            {
                errors.Add($"Author's name must be {MaxNameLength} characters or fewer.");
            }

            if (request.PlayerCount < 1 || request.PlayerCount > MaxPlayers)
                errors.Add($"Number of players must be between 1 and {MaxPlayers}.");

            var tiles = ParseTiles(request.Tiles, errors);
            if (tiles.Count == 0 && errors.Count == 0) errors.Add("Add at least one tile.");
            await ValidateTiles(tiles, errors);

            byte[]? fileData = null;
            if (request.File == null || request.File.Length == 0)
            {
                if (filesRequired) errors.Add("A map PDF is required.");
            }
            else
            {
                using var stream = new MemoryStream();
                await request.File.CopyToAsync(stream);
                fileData = stream.ToArray();
                if (!_pdfService.IsPdf(fileData)) errors.Add("The map file must be a PDF.");
            }

            byte[]? thumbnailData = null;
            if (request.Thumbnail == null || request.Thumbnail.Length == 0)
            {
                if (filesRequired) errors.Add("A thumbnail image is required.");
            }
            else
            {
                using var thumbStream = new MemoryStream();
                await request.Thumbnail.CopyToAsync(thumbStream);
                var image = thumbStream.ToArray();
                if (!_imageService.IsPng(image) && !_imageService.IsJpg(image))
                {
                    errors.Add("The thumbnail must be a PNG or JPG image.");
                }
                else
                {
                    try
                    {
                        thumbnailData = _imageService.EncodeWebp(image, ThumbnailMaxWidth, ThumbnailMaxHeight);
                    }
                    catch (Exception)
                    {
                        errors.Add("The thumbnail image could not be read.");
                    }
                }
            }

            if (errors.Count > 0) throw new MapException(errors.ToArray());

            return new ValidatedMap
            {
                Name = name!,
                CreatorId = creatorId,
                CustomerName = customerName,
                Tiles = tiles,
                FileData = fileData,
                ThumbnailData = thumbnailData
            };
        }

        /// <summary>The random suffix keeps two maps with the same name from overwriting each other's PDF.</summary>
        private static (string FilePath, string ThumbnailPath) NewPaths(string name)
        {
            var slug = SlugHelper.Slugify(name);
            var baseName = $"{(slug.Length > 0 ? slug : "map")}-{Guid.NewGuid().ToString("N")[..8]}";
            return ($"/{MapsBucket}/{baseName}.pdf", $"/{MapsBucket}/thumbs/{baseName}.webp");
        }

        private async Task StoreFiles(byte[] fileData, string filePath, byte[] thumbnailData, string thumbnailPath)
        {
            await _blobStorage.UploadAsync(fileData, filePath);
            try
            {
                await _blobStorage.UploadAsync(thumbnailData, thumbnailPath);
            }
            catch
            {
                await DeleteQuietly(filePath);
                throw;
            }
        }

        private static MapTile ToTile(MapTileRequest t) => new()
        {
            TerrainTypeId = t.TerrainTypeId,
            TerrainSizeId = t.TerrainSizeId,
            Quantity = t.Quantity
        };

        private async Task DeleteQuietly(string path)
        {
            try { await _blobStorage.DeleteAsync(path); } catch { /* best effort */ }
        }

        /// <summary>Repeated type/size rows are merged by adding their quantities.</summary>
        private static List<MapTileRequest> ParseTiles(string? json, List<string> errors)
        {
            if (string.IsNullOrWhiteSpace(json)) return new List<MapTileRequest>();

            List<MapTileRequest>? parsed;
            try
            {
                parsed = JsonConvert.DeserializeObject<List<MapTileRequest>>(json);
            }
            catch (JsonException)
            {
                errors.Add("Tiles could not be read.");
                return new List<MapTileRequest>();
            }

            if (parsed == null) return new List<MapTileRequest>();

            if (parsed.Any(t => t.Quantity < 1))
            {
                errors.Add("Each tile quantity must be at least 1.");
            }

            return parsed
                .GroupBy(t => (t.TerrainTypeId, t.TerrainSizeId))
                .Select(g => new MapTileRequest
                {
                    TerrainTypeId = g.Key.TerrainTypeId,
                    TerrainSizeId = g.Key.TerrainSizeId,
                    Quantity = g.Sum(t => t.Quantity)
                })
                .ToList();
        }

        private async Task ValidateTiles(List<MapTileRequest> tiles, List<string> errors)
        {
            if (tiles.Count == 0) return;

            var typeIds = await _mapRepository.GetTerrainTypeIds();
            var sizeIds = await _mapRepository.GetTerrainSizeIds();

            if (tiles.Any(t => !typeIds.Contains(t.TerrainTypeId))) errors.Add("A tile has an unknown terrain type.");
            if (tiles.Any(t => !sizeIds.Contains(t.TerrainSizeId))) errors.Add("A tile has an unknown terrain size.");

            // Some types only come in certain sizes (e.g. trees); types without a restriction allow every size.
            var allowedSizes = await _mapRepository.GetAllowedSizeIds();
            if (tiles.Any(t => allowedSizes.TryGetValue(t.TerrainTypeId, out var allowed) && !allowed.Contains(t.TerrainSizeId)))
                errors.Add("A tile uses a terrain size that isn't available for its terrain type.");
        }
    }
}
