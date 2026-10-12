using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    public class ArmyBuilderService
    {
        private const int MaxNameLength = 100;
        private const int MaxNotesLength = 10000;
        private const string UniqueRarity = "Unique";

        private readonly ArmyBuilderRepository _armyBuilderRepository;
        private readonly ArmyGameRepository _gameRepository;

        public ArmyBuilderService(ArmyBuilderRepository armyBuilderRepository, ArmyGameRepository gameRepository)
        {
            _armyBuilderRepository = armyBuilderRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<ArmyBuilderEntity>> GetMyArmyBuilders(Guid userId)
        {
            var id = userId.ToString();
            var armyBuilders = await _armyBuilderRepository.GetAllForUser(id);
            var owned = await _armyBuilderRepository.GetOwnedQuantities(id);
            var tallies = await _gameRepository.GetTallies(id);

            return armyBuilders
                .Select(x => WithTally(x.ToArmyBuilderEntity(owned), tallies))
                .OrderBy(x => x.Name)
                .ToList();
        }

        public async Task<ArmyBuilderEntity> GetMyArmyBuilder(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            var armyBuilder = await _armyBuilderRepository.GetForUser(id, armyBuilderId)
                ?? throw NotFound();

            var entity = armyBuilder.ToArmyBuilderEntity(await _armyBuilderRepository.GetOwnedQuantities(id));
            return WithTally(entity, await _gameRepository.GetTallies(id));
        }

        private static ArmyBuilderEntity WithTally(ArmyBuilderEntity entity, Dictionary<int, (int Wins, int Losses)> tallies)
        {
            if (tallies.TryGetValue(entity.Id, out var tally))
            {
                entity.Wins = tally.Wins;
                entity.Losses = tally.Losses;
            }
            return entity;
        }

        /// <summary>
        /// Public lookup. Only army builders that are currently shared resolve. The owner (when signed in)
        /// gets the owner view of their own army builder; everyone else gets a read-only view.
        /// </summary>
        public async Task<ArmyBuilderEntity> GetSharedArmyBuilder(Guid shareId, Guid? viewerId)
        {
            var armyBuilder = await _armyBuilderRepository.GetShared(shareId)
                ?? throw NotFound();

            var isOwner = viewerId != null && armyBuilder.UserId == viewerId.Value.ToString();
            var owned = isOwner ? await _armyBuilderRepository.GetOwnedQuantities(armyBuilder.UserId) : null;

            return armyBuilder.ToArmyBuilderEntity(owned);
        }

        public async Task<ArmyBuilderEntity> CreateArmyBuilder(Guid userId, ArmyBuilderSaveRequest request)
        {
            var id = userId.ToString();
            var validated = await Validate(id, request, excludeId: null);

            var now = DateTime.UtcNow;
            var armyBuilder = new ArmyBuilder
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
                ArmyBuilderUnits = validated.Units
                    .Select(unit => new ArmyBuilderUnit { ArmyCardId = unit.Key, Quantity = unit.Value })
                    .ToList(),
            };

            _armyBuilderRepository.Add(armyBuilder);
            await Save(id, validated.Name, excludeId: null);

            return await GetMyArmyBuilder(userId, armyBuilder.Id);
        }

        public async Task<ArmyBuilderEntity> UpdateArmyBuilder(Guid userId, int armyBuilderId, ArmyBuilderSaveRequest request)
        {
            var id = userId.ToString();
            var armyBuilder = await _armyBuilderRepository.GetForUser(id, armyBuilderId, track: true)
                ?? throw NotFound();

            var validated = await Validate(id, request, excludeId: armyBuilderId);

            armyBuilder.Name = validated.Name;
            armyBuilder.PointLimit = validated.PointLimit;
            armyBuilder.PointSystem = validated.PointSystem;
            armyBuilder.Creator = validated.Creator;
            armyBuilder.Notes = validated.Notes;
            armyBuilder.UpdatedAt = DateTime.UtcNow;

            var existing = armyBuilder.ArmyBuilderUnits.ToDictionary(x => x.ArmyCardId);
            foreach (var current in existing.Values.Where(x => !validated.Units.ContainsKey(x.ArmyCardId)).ToList())
            {
                _armyBuilderRepository.RemoveUnit(current);
            }
            foreach (var desired in validated.Units)
            {
                if (existing.TryGetValue(desired.Key, out var current))
                {
                    current.Quantity = desired.Value;
                }
                else
                {
                    _armyBuilderRepository.AddUnit(new ArmyBuilderUnit
                    {
                        ArmyBuilderId = armyBuilder.Id,
                        ArmyCardId = desired.Key,
                        Quantity = desired.Value,
                    });
                }
            }

            await Save(id, validated.Name, excludeId: armyBuilderId);

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        public async Task DeleteArmyBuilder(Guid userId, int armyBuilderId)
        {
            var armyBuilder = await _armyBuilderRepository.GetForUser(userId.ToString(), armyBuilderId, track: true)
                ?? throw NotFound();

            // The results stay (they feed the power ranking); they just stop pointing at the deleted army.
            await _gameRepository.DetachFromArmyBuilder(userId.ToString(), armyBuilderId);
            _armyBuilderRepository.Remove(armyBuilder);
            await _armyBuilderRepository.SaveChanges();
        }

        /// <summary>
        /// Shares or hides an army builder. The share key never changes, so re-sharing restores the same link.
        /// </summary>
        public async Task<ArmyBuilderEntity> SetShared(Guid userId, int armyBuilderId, bool isShared)
        {
            var armyBuilder = await _armyBuilderRepository.GetForUser(userId.ToString(), armyBuilderId, track: true)
                ?? throw NotFound();

            armyBuilder.IsShared = isShared;
            await _armyBuilderRepository.SaveChanges();

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        /// <summary>
        /// Retires or restores an army. Retiring only hides it from the active list; nothing else about it changes.
        /// </summary>
        public async Task<ArmyBuilderEntity> SetRetired(Guid userId, int armyBuilderId, bool isRetired)
        {
            var armyBuilder = await _armyBuilderRepository.GetForUser(userId.ToString(), armyBuilderId, track: true)
                ?? throw NotFound();

            if (armyBuilder.IsRetired != isRetired)
            {
                armyBuilder.IsRetired = isRetired;
                armyBuilder.RetiredAt = isRetired ? DateTime.UtcNow : null;
                await _armyBuilderRepository.SaveChanges();
            }

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        // A tuple, not a nested type: everything in this namespace is auto-registered with DI (see RegisterService).
        private async Task<(string Name, int PointLimit, PointSystem PointSystem, string? Creator, string? Notes, Dictionary<int, int> Units)> Validate(string userId, ArmyBuilderSaveRequest request, int? excludeId)
        {
            var errors = new List<string>();

            var name = request.Name?.Trim() ?? string.Empty;
            if (name.Length == 0)
            {
                errors.Add("An army name is required.");
            }
            else if (name.Length > MaxNameLength)
            {
                errors.Add($"Army names can be at most {MaxNameLength} characters.");
            }
            else if (await _armyBuilderRepository.NameInUse(userId, name, excludeId))
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Conflict, $"You already have an army named \"{name}\". Army names must be unique.");
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

            // Stored comma-separated in the single Creator column; a lone value is the old single-creator format.
            var allowedCreators = new List<string>();
            if (!string.IsNullOrWhiteSpace(request.Creator))
            {
                var knownCreators = await _armyBuilderRepository.GetCreators();
                foreach (var requestedCreator in request.Creator.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                {
                    var match = knownCreators.FirstOrDefault(x => string.Equals(x, requestedCreator, StringComparison.OrdinalIgnoreCase));
                    if (match == null)
                    {
                        errors.Add($"\"{requestedCreator}\" is not a known creator.");
                    }
                    else if (!allowedCreators.Contains(match, StringComparer.OrdinalIgnoreCase))
                    {
                        allowedCreators.Add(match);
                    }
                }
            }
            var creator = allowedCreators.Count > 0 ? string.Join(",", allowedCreators) : null;

            var requested = request.Units ?? new List<ArmyBuilderUnitRequest>();
            if (requested.Any(x => x.Quantity <= 0))
            {
                errors.Add("Unit quantities must be at least 1.");
            }

            var units = requested
                .Where(x => x.Quantity > 0)
                .GroupBy(x => x.UnitId)
                .ToDictionary(group => group.Key, group => group.Sum(x => x.Quantity));

            var cards = (await _armyBuilderRepository.GetArmyCards(units.Keys)).ToDictionary(x => x.Id);
            var owned = await _armyBuilderRepository.GetOwnedQuantities(userId);

            foreach (var (unitId, quantity) in units)
            {
                if (!cards.TryGetValue(unitId, out var card))
                {
                    errors.Add($"Unit {unitId} does not exist.");
                    continue;
                }

                var unitName = card.Name ?? $"Unit {unitId}";
                owned.TryGetValue(unitId, out var ownedQuantity);

                if (!request.AllowUnowned)
                {
                    if (ownedQuantity == 0)
                    {
                        errors.Add($"{unitName} is not in My Collection.");
                    }
                    else if (quantity > ownedQuantity)
                    {
                        errors.Add($"You only own {ownedQuantity} of {unitName} but this army uses {quantity}.");
                    }
                }

                if (allowedCreators.Count > 0 && !allowedCreators.Contains(card.Creator, StringComparer.OrdinalIgnoreCase))
                {
                    errors.Add($"{unitName} is from {card.Creator}, but this army is restricted to {creator}.");
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
                errors.Add($"{uniqueName} is a Unique unit and can only be in an army once.");
            }

            var totalPoints = units.Sum(x => (cards.TryGetValue(x.Key, out var card) ? PointsFor(card, request.PointSystem) : 0) * x.Value);
            if (request.PointLimit > 0 && totalPoints > request.PointLimit)
            {
                errors.Add($"Total {request.PointSystem} points ({totalPoints}) exceed the army limit ({request.PointLimit}).");
            }

            if (errors.Count > 0)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, errors.ToArray());
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
                await _armyBuilderRepository.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (!await _armyBuilderRepository.NameInUse(userId, name, excludeId))
                {
                    throw;
                }
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Conflict, $"You already have an army named \"{name}\". Army names must be unique.");
            }
        }

        private static ArmyBuilderException NotFound()
        {
            return new ArmyBuilderException(ArmyBuilderErrorKind.NotFound, "Army not found.");
        }
    }
}
