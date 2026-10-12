using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Win/loss log for a user's armies. Each logged game keeps the army's units (unit, quantity, points) as they
    /// were at the time, so later edits to the army never rewrite old results.
    /// </summary>
    public class ArmyGameService
    {
        private const int MaxBatch = 200;
        private const int MaxNoteLength = 500;
        private const int MaxGamesPerUser = 5000;
        private const int RecentGamesShown = 25;

        private readonly ArmyBuilderRepository _armyBuilderRepository;
        private readonly ArmyGameRepository _gameRepository;

        public ArmyGameService(ArmyBuilderRepository armyBuilderRepository, ArmyGameRepository gameRepository)
        {
            _armyBuilderRepository = armyBuilderRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<ArmyGameEntity>> GetRecentGames(Guid userId, int armyBuilderId)
        {
            var id = userId.ToString();
            _ = await _armyBuilderRepository.GetForUser(id, armyBuilderId) ?? throw NotFound();

            return (await _gameRepository.GetRecent(id, armyBuilderId, RecentGamesShown))
                .Select(ToEntity)
                .ToList();
        }

        /// <summary>Records one game, or several identical results at once, and returns the army's new tally.</summary>
        public async Task<ArmyTally> LogGames(Guid userId, int armyBuilderId, ArmyGameRequest request)
        {
            var id = userId.ToString();
            var armyBuilder = await _armyBuilderRepository.GetForUser(id, armyBuilderId) ?? throw NotFound();

            var errors = new List<string>();
            if (request.Count < 1 || request.Count > MaxBatch)
            {
                errors.Add($"You can record between 1 and {MaxBatch} results at a time.");
            }

            var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();
            if (note?.Length > MaxNoteLength)
            {
                errors.Add($"Notes can be at most {MaxNoteLength} characters.");
            }

            var now = DateTime.UtcNow;
            var playedAt = request.PlayedAt?.ToUniversalTime() ?? now;
            if (playedAt > now.AddDays(1))
            {
                errors.Add("A game cannot be dated in the future.");
            }

            var units = armyBuilder.ArmyBuilderUnits
                .Select(unit => new { unit.ArmyCardId, unit.Quantity, Points = PointsFor(unit.ArmyCard, armyBuilder.PointSystem) })
                .ToList();
            if (units.Count == 0)
            {
                errors.Add("Add some units to this army before recording a result.");
            }

            if (errors.Count == 0 && await _gameRepository.CountForUser(id) + request.Count > MaxGamesPerUser)
            {
                errors.Add($"That would go over the limit of {MaxGamesPerUser} recorded games.");
            }

            if (errors.Count > 0)
            {
                throw new ArmyBuilderException(ArmyBuilderErrorKind.Validation, errors.ToArray());
            }

            for (var i = 0; i < request.Count; i++)
            {
                _gameRepository.Add(new ArmyGame
                {
                    UserId = id,
                    ArmyBuilderId = armyBuilderId,
                    Won = request.Won,
                    PlayedAt = playedAt,
                    Note = note,
                    CreatedAt = now,
                    Units = units
                        .Select(unit => new ArmyGameUnit { ArmyCardId = unit.ArmyCardId, Quantity = unit.Quantity, Points = unit.Points })
                        .ToList(),
                });
            }

            await _gameRepository.SaveChanges();
            return await GetTally(id, armyBuilderId);
        }

        public async Task<ArmyTally> DeleteGame(Guid userId, int gameId)
        {
            var id = userId.ToString();
            var game = await _gameRepository.GetOwned(id, gameId) ?? throw new ArmyBuilderException(ArmyBuilderErrorKind.NotFound, "Game not found.");

            var armyBuilderId = game.ArmyBuilderId;
            _gameRepository.Remove(game);
            await _gameRepository.SaveChanges();

            return armyBuilderId == null ? new ArmyTally() : await GetTally(id, armyBuilderId.Value);
        }

        private async Task<ArmyTally> GetTally(string userId, int armyBuilderId)
        {
            var tallies = await _gameRepository.GetTallies(userId);
            return tallies.TryGetValue(armyBuilderId, out var tally)
                ? new ArmyTally { Wins = tally.Wins, Losses = tally.Losses }
                : new ArmyTally();
        }

        private static int PointsFor(ArmyCard card, PointSystem system)
        {
            var points = card.PointValues;
            return system.Resolve(points?.StandardPoints, points?.RenegadePoints, points?.DeltaPoints) ?? 0;
        }

        private static ArmyGameEntity ToEntity(ArmyGame game)
        {
            return new ArmyGameEntity { Id = game.Id, Won = game.Won, PlayedAt = game.PlayedAt, Note = game.Note };
        }

        private static ArmyBuilderException NotFound()
        {
            return new ArmyBuilderException(ArmyBuilderErrorKind.NotFound, "Army not found.");
        }
    }
}
