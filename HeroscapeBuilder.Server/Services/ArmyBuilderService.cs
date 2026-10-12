using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// An army is one primary version plus any number of point variations (the same army built for another point
    /// limit). Each variation is its own armybuilder row with its own units, results and journal; the primary
    /// carries the share link and retired state, and the name is shared. Everything else about a variation (point
    /// limit, point system, creator restriction, notes, units) is its own, so a variation can differ in any way.
    /// </summary>
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
            var rows = await _armyBuilderRepository.GetAllForUser(id);
            var owned = await _armyBuilderRepository.GetOwnedQuantities(id);
            var tallies = await _gameRepository.GetTallies(id);

            // Each primary version stands for its army; its variations hang off it.
            return rows
                .Where(x => x.ParentArmyBuilderId == null)
                .Select(root => Compose(root, root, rows.Where(x => x.Id == root.Id || x.ParentArmyBuilderId == root.Id).ToList(), owned, tallies))
                .OrderBy(x => x.Name)
                .ToList();
        }

        /// <summary>
        /// One point variation of an army (any variation id works, the primary included), with the army's
        /// variations summarised alongside.
        /// </summary>
        public async Task<ArmyBuilderEntity> GetMyArmyBuilder(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            var armyId = await _armyBuilderRepository.GetArmyId(id, armyBuilderId)
                ?? throw NotFound();

            var army = await _armyBuilderRepository.GetArmy(id, armyId);
            var root = army.FirstOrDefault(x => x.Id == armyId) ?? throw NotFound();
            var row = army.FirstOrDefault(x => x.Id == armyBuilderId) ?? throw NotFound();

            return Compose(row, root, army, await _armyBuilderRepository.GetOwnedQuantities(id), await _gameRepository.GetTallies(id));
        }

        /// <summary>
        /// The row's own units and limit, with sharing and retiring taken from the army's primary version and the
        /// army's variations summarised. Owner-only data (share key, results) needs owned/tallies.
        /// </summary>
        private static ArmyBuilderEntity Compose(
            ArmyBuilder row,
            ArmyBuilder root,
            List<ArmyBuilder> army,
            Dictionary<int, int>? owned,
            Dictionary<int, (int Wins, int Losses)>? tallies)
        {
            var isOwner = owned != null;
            (int Wins, int Losses) TallyOf(int id) => tallies != null && tallies.TryGetValue(id, out var tally) ? tally : (0, 0);

            var entity = row.ToArmyBuilderEntity(owned);
            var (wins, losses) = TallyOf(row.Id);
            entity.Wins = wins;
            entity.Losses = losses;
            entity.ArmyId = root.Id;
            entity.IsShared = root.IsShared;
            entity.ShareId = isOwner ? root.ShareId : null;
            entity.IsRetired = isOwner && root.IsRetired;
            entity.RetiredAt = isOwner ? root.RetiredAt : null;
            entity.Variations = army
                .OrderBy(x => x.PointLimit)
                .Select(variation =>
                {
                    var summary = variation.ToArmyBuilderEntity(owned);
                    var (variationWins, variationLosses) = TallyOf(variation.Id);
                    return new ArmyBuilderVariationEntity
                    {
                        Id = variation.Id,
                        Label = variation.VariationLabel,
                        PointLimit = variation.PointLimit,
                        PointSystem = variation.PointSystem,
                        Creator = variation.Creator,
                        TotalPoints = summary.TotalPoints,
                        UnitCount = summary.Units.Sum(unit => unit.Quantity),
                        Wins = variationWins,
                        Losses = variationLosses,
                        NeedsReview = summary.NeedsReview,
                    };
                })
                .ToList();

            return entity;
        }

        /// <summary>
        /// Public lookup. Only armies that are currently shared resolve. The owner (when signed in)
        /// gets the owner view of their own army; everyone else gets a read-only view. A shared link covers every
        /// point variation of the army; variationId picks which one to show (the primary when omitted).
        /// </summary>
        public async Task<ArmyBuilderEntity> GetSharedArmyBuilder(Guid shareId, Guid? viewerId, int? variationId = null)
        {
            var root = await _armyBuilderRepository.GetShared(shareId)
                ?? throw NotFound();

            var army = (await _armyBuilderRepository.GetSharedVariations(root.Id)).Prepend(root).ToList();
            var row = army.FirstOrDefault(x => x.Id == variationId) ?? root;

            var isOwner = viewerId != null && root.UserId == viewerId.Value.ToString();
            var owned = isOwner ? await _armyBuilderRepository.GetOwnedQuantities(root.UserId) : null;

            return Compose(row, root, army, owned, tallies: null);
        }

        /// <summary>
        /// Creates a new army, or - with request.ArmyId - adds a point variation to an existing one.
        /// </summary>
        public async Task<ArmyBuilderEntity> CreateArmyBuilder(Guid userId, ArmyBuilderSaveRequest request)
        {
            var id = userId.ToString();

            ArmyBuilder? root = null;
            if (request.ArmyId is int armyId)
            {
                root = await _armyBuilderRepository.GetForUser(id, armyId);
                if (root == null || root.ParentArmyBuilderId != null)
                {
                    throw NotFound();
                }

                // A variation is a full army of its own; only the name is the army's.
                request.Name = root.Name;
            }

            var validated = await Validate(id, request, armyId: root?.Id);

            var now = DateTime.UtcNow;
            var armyBuilder = new ArmyBuilder
            {
                UserId = id,
                ParentArmyBuilderId = root?.Id,
                Name = validated.Name,
                VariationLabel = validated.Label,
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
            await Save(id, validated.Name, root?.Id);

            return await GetMyArmyBuilder(userId, armyBuilder.Id);
        }

        public async Task<ArmyBuilderEntity> UpdateArmyBuilder(Guid userId, int armyBuilderId, ArmyBuilderSaveRequest request)
        {
            var id = userId.ToString();
            var armyBuilder = await _armyBuilderRepository.GetForUser(id, armyBuilderId, track: true)
                ?? throw NotFound();
            var armyId = armyBuilder.ParentArmyBuilderId ?? armyBuilder.Id;

            var validated = await Validate(id, request, armyId);

            // Only the army's name is shared; each variation keeps its own limit, point system, creator and notes.
            var siblings = (await _armyBuilderRepository.GetArmy(id, armyId, track: true))
                .Where(x => x.Id != armyBuilderId)
                .ToList();
            var now = DateTime.UtcNow;
            foreach (var sibling in siblings.Where(x => x.Name != validated.Name))
            {
                sibling.Name = validated.Name;
                sibling.UpdatedAt = now;
            }

            armyBuilder.Name = validated.Name;
            armyBuilder.VariationLabel = validated.Label;
            armyBuilder.PointLimit = validated.PointLimit;
            armyBuilder.PointSystem = validated.PointSystem;
            armyBuilder.Creator = validated.Creator;
            armyBuilder.Notes = validated.Notes;
            armyBuilder.UpdatedAt = now;

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

            await Save(id, validated.Name, armyId);

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        /// <summary>
        /// Deletes the whole army: every point variation, with their units and journals. Logged results stay
        /// (they feed the power ranking); they just stop pointing at the deleted army.
        /// </summary>
        public async Task DeleteArmyBuilder(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            var armyId = await _armyBuilderRepository.GetArmyId(id, armyBuilderId)
                ?? throw NotFound();
            var army = await _armyBuilderRepository.GetArmy(id, armyId, track: true);

            foreach (var row in army)
            {
                await _gameRepository.DetachFromArmyBuilder(id, row.Id);
            }

            foreach (var variation in army.Where(x => x.Id != armyId))
            {
                _armyBuilderRepository.Remove(variation);
            }
            _armyBuilderRepository.Remove(army.First(x => x.Id == armyId));
            await _armyBuilderRepository.SaveChanges();
        }

        /// <summary>
        /// Deletes one point variation and leaves the rest of the army. Deleting the primary version promotes the
        /// lowest-point variation to take its place (share link, retired state). Returns the variation to show next.
        /// </summary>
        public async Task<ArmyBuilderEntity> DeleteVariation(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            var armyId = await _armyBuilderRepository.GetArmyId(id, armyBuilderId)
                ?? throw NotFound();
            var army = await _armyBuilderRepository.GetArmy(id, armyId, track: true);
            var row = army.First(x => x.Id == armyBuilderId);

            if (army.Count < 2)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, "This is the army's only version. Delete the army instead.");
            }

            await _gameRepository.DetachFromArmyBuilder(id, row.Id);

            var remaining = army.Where(x => x.Id != row.Id).OrderBy(x => x.PointLimit).ToList();
            var survivor = remaining[0];

            if (row.ParentArmyBuilderId != null)
            {
                _armyBuilderRepository.Remove(row);
                await _armyBuilderRepository.SaveChanges();
            }
            else
            {
                var isShared = row.IsShared;
                var shareId = row.ShareId;
                var isRetired = row.IsRetired;
                var retiredAt = row.RetiredAt;
                var createdAt = row.CreatedAt;

                await _armyBuilderRepository.InTransaction(async () =>
                {
                    // The survivor takes over the primary's name slot and share link, which are unique, so the
                    // old primary lets go of both before it is replaced.
                    row.Name = $"~{Guid.NewGuid():N}";
                    row.ShareId = Guid.NewGuid();
                    await _armyBuilderRepository.SaveChanges();

                    survivor.ParentArmyBuilderId = null;
                    survivor.IsShared = isShared;
                    survivor.ShareId = shareId;
                    survivor.IsRetired = isRetired;
                    survivor.RetiredAt = retiredAt;
                    survivor.CreatedAt = createdAt;
                    foreach (var other in remaining.Skip(1))
                    {
                        other.ParentArmyBuilderId = survivor.Id;
                    }

                    _armyBuilderRepository.Remove(row);
                    await _armyBuilderRepository.SaveChanges();
                });
            }

            return await GetMyArmyBuilder(userId, survivor.Id);
        }

        /// <summary>
        /// Shares or hides an army (all of its point variations). The share key never changes, so re-sharing
        /// restores the same link.
        /// </summary>
        public async Task<ArmyBuilderEntity> SetShared(Guid userId, int armyBuilderId, bool isShared)
        {
            var primary = await GetPrimary(userId, armyBuilderId);

            primary.IsShared = isShared;
            await _armyBuilderRepository.SaveChanges();

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        /// <summary>
        /// Retires or restores an army. Retiring only hides it from the active list; nothing else about it changes.
        /// </summary>
        public async Task<ArmyBuilderEntity> SetRetired(Guid userId, int armyBuilderId, bool isRetired)
        {
            var primary = await GetPrimary(userId, armyBuilderId);

            if (primary.IsRetired != isRetired)
            {
                primary.IsRetired = isRetired;
                primary.RetiredAt = isRetired ? DateTime.UtcNow : null;
                await _armyBuilderRepository.SaveChanges();
            }

            return await GetMyArmyBuilder(userId, armyBuilderId);
        }

        /// <summary>The army's primary version (tracked), given the id of any of its variations.</summary>
        private async Task<ArmyBuilder> GetPrimary(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            var armyId = await _armyBuilderRepository.GetArmyId(id, armyBuilderId)
                ?? throw NotFound();

            return await _armyBuilderRepository.GetForUser(id, armyId, track: true)
                ?? throw NotFound();
        }

        // A tuple, not a nested type: everything in this namespace is auto-registered with DI (see RegisterService).
        private async Task<(string Name, string? Label, int PointLimit, PointSystem PointSystem, string? Creator, string? Notes, Dictionary<int, int> Units)> Validate(string userId, ArmyBuilderSaveRequest request, int? armyId)
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
            else if (await _armyBuilderRepository.NameInUse(userId, name, armyId))
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Conflict, $"You already have an army named \"{name}\". Army names must be unique.");
            }

            var label = string.IsNullOrWhiteSpace(request.VariationLabel) ? null : request.VariationLabel.Trim();
            if (label?.Length > MaxNameLength)
            {
                errors.Add($"Variation names can be at most {MaxNameLength} characters.");
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

            return (name, label, request.PointLimit, request.PointSystem, creator, notes, units);
        }

        private static int PointsFor(ArmyCard card, PointSystem system)
        {
            var points = card.PointValues;
            return system.Resolve(points?.StandardPoints, points?.RenegadePoints, points?.DeltaPoints) ?? 0;
        }

        /// <summary>
        /// Saves, turning a unique-name race (two requests using the same name) into a proper conflict.
        /// </summary>
        private async Task Save(string userId, string name, int? armyId)
        {
            try
            {
                await _armyBuilderRepository.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (!await _armyBuilderRepository.NameInUse(userId, name, armyId))
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
