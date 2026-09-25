using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    public class BattlegroupService
    {
        private const int MaxNameLength = 100;
        private const int MaxNotesLength = 10000;
        private const string UniqueRarity = "Unique";

        private readonly BattlegroupRepository _battlegroupRepository;

        public BattlegroupService(BattlegroupRepository battlegroupRepository)
        {
            _battlegroupRepository = battlegroupRepository;
        }

        public async Task<List<BattlegroupEntity>> GetMyBattlegroups(Guid userId)
        {
            var id = userId.ToString();
            var battlegroups = await _battlegroupRepository.GetAllForUser(id);
            var owned = await _battlegroupRepository.GetOwnedQuantities(id);

            return battlegroups
                .Select(x => x.ToBattlegroupEntity(owned))
                .OrderBy(x => x.Name)
                .ToList();
        }

        public async Task<BattlegroupEntity> GetMyBattlegroup(Guid userId, int battlegroupId)
        {
            var id = userId.ToString();
            var battlegroup = await _battlegroupRepository.GetForUser(id, battlegroupId)
                ?? throw NotFound();

            return battlegroup.ToBattlegroupEntity(await _battlegroupRepository.GetOwnedQuantities(id));
        }

        /// <summary>
        /// Public lookup. Only battlegroups that are currently shared resolve. The owner (when signed in)
        /// gets the owner view of their own battlegroup; everyone else gets a read-only view.
        /// </summary>
        public async Task<BattlegroupEntity> GetSharedBattlegroup(Guid shareId, Guid? viewerId)
        {
            var battlegroup = await _battlegroupRepository.GetShared(shareId)
                ?? throw NotFound();

            var isOwner = viewerId != null && battlegroup.UserId == viewerId.Value.ToString();
            var owned = isOwner ? await _battlegroupRepository.GetOwnedQuantities(battlegroup.UserId) : null;

            return battlegroup.ToBattlegroupEntity(owned);
        }

        public async Task<BattlegroupEntity> CreateBattlegroup(Guid userId, BattlegroupSaveRequest request)
        {
            var id = userId.ToString();
            var validated = await Validate(id, request, excludeId: null);

            var now = DateTime.UtcNow;
            var battlegroup = new Battlegroup
            {
                UserId = id,
                Name = validated.Name,
                PointLimit = validated.PointLimit,
                PointSystem = validated.PointSystem,
                Creator = validated.Creator,
                Notes = validated.Notes,
                IsShared = false,
                ShareId = Guid.NewGuid(),
                CreatedAt = now,
                UpdatedAt = now,
                BattlegroupUnits = validated.Units
                    .Select(unit => new BattlegroupUnit { ArmyCardId = unit.Key, Quantity = unit.Value })
                    .ToList(),
            };

            _battlegroupRepository.Add(battlegroup);
            await Save(id, validated.Name, excludeId: null);

            return await GetMyBattlegroup(userId, battlegroup.Id);
        }

        public async Task<BattlegroupEntity> UpdateBattlegroup(Guid userId, int battlegroupId, BattlegroupSaveRequest request)
        {
            var id = userId.ToString();
            var battlegroup = await _battlegroupRepository.GetForUser(id, battlegroupId, track: true)
                ?? throw NotFound();

            var validated = await Validate(id, request, excludeId: battlegroupId);

            battlegroup.Name = validated.Name;
            battlegroup.PointLimit = validated.PointLimit;
            battlegroup.PointSystem = validated.PointSystem;
            battlegroup.Creator = validated.Creator;
            battlegroup.Notes = validated.Notes;
            battlegroup.UpdatedAt = DateTime.UtcNow;

            var existing = battlegroup.BattlegroupUnits.ToDictionary(x => x.ArmyCardId);
            foreach (var current in existing.Values.Where(x => !validated.Units.ContainsKey(x.ArmyCardId)).ToList())
            {
                _battlegroupRepository.RemoveUnit(current);
            }
            foreach (var desired in validated.Units)
            {
                if (existing.TryGetValue(desired.Key, out var current))
                {
                    current.Quantity = desired.Value;
                }
                else
                {
                    _battlegroupRepository.AddUnit(new BattlegroupUnit
                    {
                        BattlegroupId = battlegroup.Id,
                        ArmyCardId = desired.Key,
                        Quantity = desired.Value,
                    });
                }
            }

            await Save(id, validated.Name, excludeId: battlegroupId);

            return await GetMyBattlegroup(userId, battlegroupId);
        }

        public async Task DeleteBattlegroup(Guid userId, int battlegroupId)
        {
            var battlegroup = await _battlegroupRepository.GetForUser(userId.ToString(), battlegroupId, track: true)
                ?? throw NotFound();

            _battlegroupRepository.Remove(battlegroup);
            await _battlegroupRepository.SaveChanges();
        }

        /// <summary>
        /// Shares or hides a battlegroup. The share key never changes, so re-sharing restores the same link.
        /// </summary>
        public async Task<BattlegroupEntity> SetShared(Guid userId, int battlegroupId, bool isShared)
        {
            var battlegroup = await _battlegroupRepository.GetForUser(userId.ToString(), battlegroupId, track: true)
                ?? throw NotFound();

            battlegroup.IsShared = isShared;
            await _battlegroupRepository.SaveChanges();

            return await GetMyBattlegroup(userId, battlegroupId);
        }

        // A tuple, not a nested type: everything in this namespace is auto-registered with DI (see RegisterService).
        private async Task<(string Name, int PointLimit, PointSystem PointSystem, string? Creator, string? Notes, Dictionary<int, int> Units)> Validate(string userId, BattlegroupSaveRequest request, int? excludeId)
        {
            var errors = new List<string>();

            var name = request.Name?.Trim() ?? string.Empty;
            if (name.Length == 0)
            {
                errors.Add("A Battlegroup name is required.");
            }
            else if (name.Length > MaxNameLength)
            {
                errors.Add($"Battlegroup names can be at most {MaxNameLength} characters.");
            }
            else if (await _battlegroupRepository.NameInUse(userId, name, excludeId))
            {
                throw new BattlegroupException(BattlegroupErrorKind.Conflict, $"You already have a Battlegroup named \"{name}\". Battlegroup names must be unique.");
            }

            if (request.PointLimit <= 0)
            {
                errors.Add("The point limit must be greater than 0.");
            }

            if (!Enum.IsDefined(request.PointSystem))
            {
                errors.Add($"\"{request.PointSystem}\" is not a known point system.");
            }

            // Notes are plain text; blank becomes null so an empty box doesn't store whitespace.
            var notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();
            if (notes?.Length > MaxNotesLength)
            {
                errors.Add($"Notes can be at most {MaxNotesLength} characters (currently {notes.Length}).");
            }

            string? creator = null;
            if (!string.IsNullOrWhiteSpace(request.Creator))
            {
                var creators = await _battlegroupRepository.GetCreators();
                creator = creators.FirstOrDefault(x => string.Equals(x, request.Creator.Trim(), StringComparison.OrdinalIgnoreCase));
                if (creator == null)
                {
                    errors.Add($"\"{request.Creator.Trim()}\" is not a known creator.");
                }
            }

            var requested = request.Units ?? new List<BattlegroupUnitRequest>();
            if (requested.Any(x => x.Quantity <= 0))
            {
                errors.Add("Unit quantities must be at least 1.");
            }

            var units = requested
                .Where(x => x.Quantity > 0)
                .GroupBy(x => x.UnitId)
                .ToDictionary(group => group.Key, group => group.Sum(x => x.Quantity));

            var cards = (await _battlegroupRepository.GetArmyCards(units.Keys)).ToDictionary(x => x.Id);
            var owned = await _battlegroupRepository.GetOwnedQuantities(userId);

            foreach (var (unitId, quantity) in units)
            {
                if (!cards.TryGetValue(unitId, out var card))
                {
                    errors.Add($"Unit {unitId} does not exist.");
                    continue;
                }

                var unitName = card.Name ?? $"Unit {unitId}";
                owned.TryGetValue(unitId, out var ownedQuantity);

                if (ownedQuantity == 0)
                {
                    errors.Add($"{unitName} is not in My Army.");
                }
                else if (quantity > ownedQuantity)
                {
                    errors.Add($"You only own {ownedQuantity} of {unitName} but this Battlegroup uses {quantity}.");
                }

                if (creator != null && !string.Equals(card.Creator, creator, StringComparison.OrdinalIgnoreCase))
                {
                    errors.Add($"{unitName} is from {card.Creator}, but this Battlegroup is restricted to {creator}.");
                }
            }

            // Unique units are limited by name so two different cards of the same unique unit can't both be used.
            var uniqueDuplicates = units
                .Where(x => cards.TryGetValue(x.Key, out var card) && string.Equals(card.Rarity, UniqueRarity, StringComparison.OrdinalIgnoreCase))
                .GroupBy(x => cards[x.Key].Name?.Trim().ToLowerInvariant() ?? string.Empty)
                .Where(group => group.Sum(x => x.Value) > 1)
                .Select(group => cards[group.First().Key].Name);
            foreach (var uniqueName in uniqueDuplicates)
            {
                errors.Add($"{uniqueName} is a Unique unit and can only be in a Battlegroup once.");
            }

            var totalPoints = units.Sum(x => (cards.TryGetValue(x.Key, out var card) ? PointsFor(card, request.PointSystem) : 0) * x.Value);
            if (request.PointLimit > 0 && totalPoints > request.PointLimit)
            {
                errors.Add($"Total {request.PointSystem} points ({totalPoints}) exceed the Battlegroup limit ({request.PointLimit}).");
            }

            if (errors.Count > 0)
            {
                throw new BattlegroupException(BattlegroupErrorKind.Validation, errors.ToArray());
            }

            return (name, request.PointLimit, request.PointSystem, creator, notes, units);
        }

        private static int PointsFor(ArmyCard card, PointSystem system)
        {
            var points = card.PointValues;
            return system.Resolve(points?.StandardPoints, points?.RenegadePoints, points?.DeltaPoints) ?? 0;
        }

        /// <summary>
        /// Saves, turning a unique-name race (two requests using the same name) into a proper conflict.
        /// </summary>
        private async Task Save(string userId, string name, int? excludeId)
        {
            try
            {
                await _battlegroupRepository.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (!await _battlegroupRepository.NameInUse(userId, name, excludeId))
                {
                    throw;
                }
                throw new BattlegroupException(BattlegroupErrorKind.Conflict, $"You already have a Battlegroup named \"{name}\". Battlegroup names must be unique.");
            }
        }

        private static BattlegroupException NotFound()
        {
            return new BattlegroupException(BattlegroupErrorKind.NotFound, "Battlegroup not found.");
        }
    }
}
