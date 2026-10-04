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

        private readonly BattlegroupRepository _battlegroupRepository;
        private readonly ArmyGameRepository _gameRepository;

        public ArmyGameService(BattlegroupRepository battlegroupRepository, ArmyGameRepository gameRepository)
        {
            _battlegroupRepository = battlegroupRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<ArmyGameEntity>> GetRecentGames(Guid userId, int battlegroupId)
        {
            var id = userId.ToString();
            _ = await _battlegroupRepository.GetForUser(id, battlegroupId) ?? throw NotFound();

            return (await _gameRepository.GetRecent(id, battlegroupId, RecentGamesShown))
                .Select(ToEntity)
                .ToList();
        }

        /// <summary>Records one game, or several identical results at once, and returns the army's new tally.</summary>
        public async Task<ArmyTally> LogGames(Guid userId, int battlegroupId, ArmyGameRequest request)
        {
            var id = userId.ToString();
            var battlegroup = await _battlegroupRepository.GetForUser(id, battlegroupId) ?? throw NotFound();

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

            var units = battlegroup.BattlegroupUnits
                .Select(unit => new { unit.ArmyCardId, unit.Quantity, Points = PointsFor(unit.ArmyCard, battlegroup.PointSystem) })
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
                throw new BattlegroupException(BattlegroupErrorKind.Validation, errors.ToArray());
            }

            for (var i = 0; i < request.Count; i++)
            {
                _gameRepository.Add(new ArmyGame
                {
                    UserId = id,
                    BattlegroupId = battlegroupId,
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
            return await GetTally(id, battlegroupId);
        }

        public async Task<ArmyTally> DeleteGame(Guid userId, int gameId)
        {
            var id = userId.ToString();
            var game = await _gameRepository.GetOwned(id, gameId) ?? throw new BattlegroupException(BattlegroupErrorKind.NotFound, "Game not found.");

            var battlegroupId = game.BattlegroupId;
            _gameRepository.Remove(game);
            await _gameRepository.SaveChanges();

            return battlegroupId == null ? new ArmyTally() : await GetTally(id, battlegroupId.Value);
        }

        private async Task<ArmyTally> GetTally(string userId, int battlegroupId)
        {
            var tallies = await _gameRepository.GetTallies(userId);
            return tallies.TryGetValue(battlegroupId, out var tally)
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

        private static BattlegroupException NotFound()
        {
            return new BattlegroupException(BattlegroupErrorKind.NotFound, "Army not found.");
        }
    }
}
