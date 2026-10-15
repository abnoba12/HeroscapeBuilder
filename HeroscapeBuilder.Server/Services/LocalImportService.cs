using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Takes in what a visitor saved in their browser before they had an account, so none of their work is lost.
    /// It merges into whatever the account already holds: owned quantities never go down, and an army whose name
    /// is taken arrives with "(imported)" added rather than replacing the existing one.
    /// </summary>
    public class LocalImportService
    {
        private const int MaxCards = 5000;
        private const int MaxTerrain = 1000;
        private const int MaxArmies = 1000;
        private const int MaxNameLength = 100;
        private const int MaxNotesLength = 10000;
        private const int MaxFieldLength = 4000;
        private const int MaxNoteLength = 500;
        private const int MaxGamesPerUser = 5000;
        private const int MaxJournalPerArmy = 500;
        private const int MaxQuantity = 10000;

        private readonly HsbDbContext _context;

        public LocalImportService(HsbDbContext context)
        {
            _context = context;
        }

        public async Task<LocalImportResult> Import(Guid userId, LocalImportRequest request)
        {
            var id = userId.ToString();

            if (request.UserCards.Count > MaxCards || request.UserTerrain.Count > MaxTerrain || request.Armies.Count > MaxArmies)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, "There is too much saved data to import in one go.");
            }

            var result = new LocalImportResult();

            await _context.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();
                _context.ChangeTracker.Clear();

                result = new LocalImportResult();
                var validCards = await ValidCardIds(request);

                result.Cards = await ImportCards(id, request, validCards);
                result.Terrain = await ImportTerrain(id, request);
                var created = await ImportArmies(id, request, validCards, result);
                await ImportGames(id, request, validCards, created, result);

                await transaction.CommitAsync();
            });

            return result;
        }

        private async Task<HashSet<int>> ValidCardIds(LocalImportRequest request)
        {
            var wanted = request.UserCards.Select(x => x.OwnedArmyCard)
                .Concat(request.Armies.SelectMany(a => a.Units.Select(u => u.ArmyCardId)))
                .Concat(request.Armies.SelectMany(a => a.Games.SelectMany(g => g.Units.Select(u => u.ArmyCardId))))
                .Concat(request.DetachedGames.SelectMany(g => g.Units.Select(u => u.ArmyCardId)))
                .Distinct()
                .ToList();

            return (await _context.ArmyCards.Where(x => wanted.Contains(x.Id)).Select(x => x.Id).ToListAsync()).ToHashSet();
        }

        private async Task<int> ImportCards(string userId, LocalImportRequest request, HashSet<int> validCards)
        {
            var desired = request.UserCards
                .Where(x => x.Quantity > 0 && validCards.Contains(x.OwnedArmyCard))
                .GroupBy(x => x.OwnedArmyCard)
                .ToDictionary(g => g.Key, g => Math.Min(g.Sum(x => x.Quantity), MaxQuantity));

            var existing = await _context.UserCards.Where(x => x.UserId == userId).ToListAsync();
            var existingByCard = existing.GroupBy(x => x.OwnedArmyCard).ToDictionary(g => g.Key, g => g.ToList());

            foreach (var (cardId, quantity) in desired)
            {
                if (existingByCard.TryGetValue(cardId, out var rows))
                {
                    var current = rows.Sum(x => x.Quantity);
                    if (quantity > current)
                    {
                        rows[0].Quantity += quantity - current;
                    }
                }
                else
                {
                    _context.UserCards.Add(new UserCard { UserId = userId, OwnedArmyCard = cardId, Quantity = quantity });
                }
            }

            await _context.SaveChangesAsync();
            return desired.Count;
        }

        private async Task<int> ImportTerrain(string userId, LocalImportRequest request)
        {
            var typeIds = (await _context.TerrainTypes.Select(x => x.Id).ToListAsync()).ToHashSet();
            var sizeIds = (await _context.TerrainSizes.Select(x => x.Id).ToListAsync()).ToHashSet();

            var desired = request.UserTerrain
                .Where(x => x.Quantity > 0 && typeIds.Contains(x.TerrainTypeId) && sizeIds.Contains(x.TerrainSizeId))
                .GroupBy(x => (x.TerrainTypeId, x.TerrainSizeId))
                .ToDictionary(g => g.Key, g => Math.Min(g.Sum(x => x.Quantity), MaxQuantity));

            var existing = await _context.UserTerrains.Where(x => x.UserId == userId).ToListAsync();
            var existingByKey = existing.ToDictionary(x => (x.TerrainTypeId, x.TerrainSizeId));

            foreach (var (key, quantity) in desired)
            {
                if (existingByKey.TryGetValue(key, out var row))
                {
                    row.Quantity = Math.Max(row.Quantity, quantity);
                }
                else
                {
                    _context.UserTerrains.Add(new UserTerrain
                    {
                        UserId = userId,
                        TerrainTypeId = key.TerrainTypeId,
                        TerrainSizeId = key.TerrainSizeId,
                        Quantity = quantity,
                    });
                }
            }

            await _context.SaveChangesAsync();
            return desired.Count;
        }

        private async Task<Dictionary<int, ArmyBuilder>> ImportArmies(string userId, LocalImportRequest request, HashSet<int> validCards, LocalImportResult result)
        {
            var created = new Dictionary<int, ArmyBuilder>();
            var journals = new List<(ArmyBuilder Army, LocalImportArmy Source)>();
            var takenNames = (await _context.ArmyBuilders
                    .Where(x => x.UserId == userId && x.ParentArmyBuilderId == null)
                    .Select(x => x.Name)
                    .ToListAsync())
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            var now = DateTime.UtcNow;
            var primaries = request.Armies.Where(x => x.ParentLocalId == null || request.Armies.All(p => p.LocalId != x.ParentLocalId)).ToList();
            var variations = request.Armies.Except(primaries).ToList();

            foreach (var source in primaries)
            {
                var name = UniqueName(Clip(source.Name, MaxNameLength) ?? "Imported army", takenNames);
                takenNames.Add(name);
                created[source.LocalId] = BuildArmy(userId, source, name, null, validCards, now);
                journals.Add((created[source.LocalId], source));
            }

            foreach (var source in variations)
            {
                var parent = created[source.ParentLocalId!.Value];
                created[source.LocalId] = BuildArmy(userId, source, parent.Name, parent, validCards, now);
                journals.Add((created[source.LocalId], source));
            }

            // Primaries must exist before the variations that point at them.
            foreach (var army in created.Values.Where(x => x.Parent == null))
            {
                _context.ArmyBuilders.Add(army);
            }
            await _context.SaveChangesAsync();

            foreach (var army in created.Values.Where(x => x.Parent != null))
            {
                _context.ArmyBuilders.Add(army);
            }
            await _context.SaveChangesAsync();

            foreach (var (army, source) in journals)
            {
                AddJournal(army, source, now);
            }
            await _context.SaveChangesAsync();

            result.Armies = created.Count;
            return created;
        }

        private static ArmyBuilder BuildArmy(string userId, LocalImportArmy source, string name, ArmyBuilder? parent, HashSet<int> validCards, DateTime now)
        {
            var created = ClampPast(source.CreatedAt, now) ?? now;
            var army = new ArmyBuilder
            {
                UserId = userId,
                Parent = parent,
                Name = name,
                VariationLabel = Clip(source.VariationLabel, MaxNameLength),
                PointLimit = Math.Max(source.PointLimit, 1),
                PointSystem = Enum.IsDefined(source.PointSystem) ? source.PointSystem : PointSystemExtensions.Default,
                Creator = Clip(source.Creator, 450),
                Notes = Clip(source.Notes, MaxNotesLength),
                IsShared = false,
                ShareId = Guid.NewGuid(),
                IsRetired = parent == null && source.IsRetired,
                RetiredAt = parent == null && source.IsRetired ? ClampPast(source.RetiredAt, now) ?? now : null,
                CreatedAt = created,
                UpdatedAt = ClampPast(source.UpdatedAt, now) ?? created,
            };

            foreach (var unit in source.Units
                         .Where(x => x.Quantity > 0 && validCards.Contains(x.ArmyCardId))
                         .GroupBy(x => x.ArmyCardId))
            {
                army.ArmyBuilderUnits.Add(new ArmyBuilderUnit
                {
                    ArmyCardId = unit.Key,
                    Quantity = Math.Min(unit.Sum(x => x.Quantity), MaxQuantity),
                });
            }

            return army;
        }

        private void AddJournal(ArmyBuilder army, LocalImportArmy source, DateTime now)
        {
            var entries = 0;
            foreach (var entry in source.Journal)
            {
                var wentWell = Clip(entry.WentWell, MaxFieldLength);
                var wentPoorly = Clip(entry.WentPoorly, MaxFieldLength);
                var notes = Clip(entry.Notes, MaxFieldLength);
                if ((wentWell == null && wentPoorly == null && notes == null) || entries >= MaxJournalPerArmy)
                {
                    continue;
                }

                entries++;
                _context.ArmyBuilderJournalEntries.Add(new ArmyBuilderJournalEntry
                {
                    ArmyBuilder = army,
                    EntryDate = entry.EntryDate,
                    WentWell = wentWell,
                    WentPoorly = wentPoorly,
                    Notes = notes,
                    CreatedAt = ClampPast(entry.CreatedAt, now) ?? now,
                    UpdatedAt = ClampPast(entry.UpdatedAt, now) ?? now,
                });
            }
        }

        private async Task ImportGames(string userId, LocalImportRequest request, HashSet<int> validCards, Dictionary<int, ArmyBuilder> created, LocalImportResult result)
        {
            var room = MaxGamesPerUser - await _context.ArmyGames.CountAsync(x => x.UserId == userId);
            var now = DateTime.UtcNow;

            var games = request.Armies
                .Where(a => created.ContainsKey(a.LocalId))
                .SelectMany(a => a.Games.Select(g => (Game: g, ArmyId: (int?)created[a.LocalId].Id)))
                .Concat(request.DetachedGames.Select(g => (Game: g, ArmyId: (int?)null)))
                .Take(Math.Max(room, 0));

            foreach (var (game, armyId) in games)
            {
                var units = game.Units
                    .Where(x => x.Quantity > 0 && validCards.Contains(x.ArmyCardId))
                    .Select(x => new ArmyGameUnit { ArmyCardId = x.ArmyCardId, Quantity = Math.Min(x.Quantity, MaxQuantity), Points = Math.Max(x.Points, 0) })
                    .ToList();

                _context.ArmyGames.Add(new ArmyGame
                {
                    UserId = userId,
                    ArmyBuilderId = armyId,
                    Won = game.Won,
                    PlayedAt = ClampPast(game.PlayedAt, now) ?? now,
                    Note = Clip(game.Note, MaxNoteLength),
                    CreatedAt = ClampPast(game.CreatedAt, now) ?? now,
                    Units = units,
                });
                result.Games++;
            }

            await _context.SaveChangesAsync();
        }

        private static string UniqueName(string name, HashSet<string> taken)
        {
            if (!taken.Contains(name))
            {
                return name;
            }

            for (var attempt = 1; ; attempt++)
            {
                var suffix = attempt == 1 ? " (imported)" : $" (imported {attempt})";
                var candidate = (name.Length + suffix.Length > MaxNameLength ? name[..(MaxNameLength - suffix.Length)] : name) + suffix;
                if (!taken.Contains(candidate))
                {
                    return candidate;
                }
            }
        }

        private static string? Clip(string? value, int max)
        {
            var trimmed = string.IsNullOrWhiteSpace(value) ? null : value.Trim();
            return trimmed?.Length > max ? trimmed[..max] : trimmed;
        }

        private static DateTime? ClampPast(DateTime? value, DateTime now)
        {
            if (value == null)
            {
                return null;
            }

            var utc = value.Value.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : value.Value.ToUniversalTime();
            return utc > now ? now : utc;
        }
    }
}
