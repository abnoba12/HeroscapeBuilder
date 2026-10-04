using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Models;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Community power ranking. Visitors answer "which unit would you rather have on your side?" for pairs of units
    /// that are close in the current ranking, and signed-in users log wins and losses for their armies. Both feed a
    /// Bradley-Terry fit that starts every unit at a strength derived from its Renegade points.
    /// </summary>
    public class PowerRankingService
    {
        // How strongly points move the starting strength: a unit worth twice the points starts about 1 log-unit up.
        private const double SeedPerDoublingOfPoints = 1.5;

        // Pairing: usually a close neighbour in the ranking, occasionally a wider one to keep the whole list anchored.
        private const int NearWindow = 5;
        private const int WideWindow = 15;
        private const double WideChance = 0.1;

        // Anonymous answers are welcome but easier to spam, so they count for less than a signed-in user's.
        private const double AnonymousVoteWeight = 0.5;
        private const int MaxVotesPerHour = 300;
        private const int MaxAnonymousVotesPerHour = 100;

        // Logged games: a game is one piece of evidence split between its units by points share. Results only count
        // for a unit once enough games from enough different players include it, and one player's games are capped.
        private const double GameEvidenceScale = 2.0;
        private const int MinGamesForResults = 30;
        private const int MinPlayersForResults = 5;
        private const int PlayerGameCap = 20;
        private const double PlayerBaselineGames = 10;

        // The ratings are rebuilt at least this often even without new votes (covers deleted games and votes).
        private static readonly TimeSpan MaxRatingAge = TimeSpan.FromHours(6);

        // Only one recompute at a time across the whole app.
        private static readonly SemaphoreSlim RecomputeLock = new(1, 1);

        private readonly PowerRankingRepository _repository;
        private readonly ArmyGameRepository _gameRepository;

        public PowerRankingService(PowerRankingRepository repository, ArmyGameRepository gameRepository)
        {
            _repository = repository;
            _gameRepository = gameRepository;
        }

        // ---------- Public reads ----------

        /// <summary>
        /// Every unit has a rank from day one: until votes say otherwise a unit sits where its Renegade points put it,
        /// and votes move it from there. Ties keep a stable order (by id) so a unit never changes place by chance.
        /// </summary>
        public async Task<PowerRankingSummary> GetRankings()
        {
            var ordered = (await GetRatingsOrBuild())
                .OrderByDescending(r => r.Rating)
                .ThenBy(r => r.ArmyCardId)
                .ToList();

            return new PowerRankingSummary
            {
                RankedCount = ordered.Count,
                Units = ordered.Select((r, i) => new UnitPowerRank { ArmyCardId = r.ArmyCardId, Rank = i + 1 }).ToList(),
            };
        }

        // ---------- Dueling ----------

        /// <summary>
        /// Picks two units that are near each other in the current ranking and that this voter has not compared yet.
        /// Returns null when the voter has already answered every pair we are willing to offer.
        /// </summary>
        public async Task<DuelPair?> GetNextDuel(Voter voter)
        {
            await ClaimAnonymousVotes(voter);

            var ratings = (await GetRatingsOrBuild()).OrderByDescending(r => r.Rating).ToList();
            if (ratings.Count < 2) return null;

            var voted = await _repository.GetVotedPairs(voter);
            var random = Random.Shared;

            for (var attempt = 0; attempt < 40; attempt++)
            {
                var index = PickLeastVoted(ratings, random);
                var window = random.NextDouble() < WideChance ? WideWindow : NearWindow;

                var candidates = new List<int>();
                for (var offset = 1; offset <= window; offset++)
                {
                    if (index - offset >= 0) candidates.Add(index - offset);
                    if (index + offset < ratings.Count) candidates.Add(index + offset);
                }

                var open = candidates
                    .Where(c => !voted.Contains(Canonical(ratings[index].ArmyCardId, ratings[c].ArmyCardId)))
                    .ToList();
                if (open.Count == 0) continue;

                var other = ratings[open[random.Next(open.Count)]];
                var (a, b) = Canonical(ratings[index].ArmyCardId, other.ArmyCardId);

                // Which unit is on the left is random, so position never hints at which one is stronger.
                return random.Next(2) == 0
                    ? new DuelPair { ArmyCardAId = a, ArmyCardBId = b }
                    : new DuelPair { ArmyCardAId = b, ArmyCardBId = a };
            }

            return null;
        }

        /// <summary>Random unit, weighted toward units with fewer votes so coverage stays even.</summary>
        private static int PickLeastVoted(List<UnitRating> ratings, Random random)
        {
            var weights = ratings.Select(r => 1.0 / (1 + r.VoteCount + r.DependsCount)).ToList();
            var roll = random.NextDouble() * weights.Sum();
            for (var i = 0; i < weights.Count; i++)
            {
                roll -= weights[i];
                if (roll <= 0) return i;
            }
            return weights.Count - 1;
        }

        public async Task Vote(Voter voter, DuelVoteRequest request)
        {
            if (request.ArmyCardAId == request.ArmyCardBId)
            {
                throw new PowerRankingException("A unit cannot be compared with itself.");
            }

            var (a, b) = Canonical(request.ArmyCardAId, request.ArmyCardBId);

            byte result;
            if (request.PreferredArmyCardId == null) result = UnitDuelVote.Depends;
            else if (request.PreferredArmyCardId == a) result = UnitDuelVote.PrefersA;
            else if (request.PreferredArmyCardId == b) result = UnitDuelVote.PrefersB;
            else throw new PowerRankingException("The chosen unit is not one of the two being compared.");

            await ClaimAnonymousVotes(voter);

            var limit = voter.IsAnonymous ? MaxAnonymousVotesPerHour : MaxVotesPerHour;
            if (await _repository.CountVotesSince(voter, DateTime.UtcNow.AddHours(-1)) >= limit)
            {
                throw new PowerRankingException("That's a lot of duels! Take a short break and come back soon.", tooManyRequests: true);
            }

            if (!await _repository.CardsExist(a, b))
            {
                throw new PowerRankingException("One of those units could not be found.");
            }

            await _repository.SaveVote(voter, a, b, result);
        }

        /// <summary>
        /// When a signed-in user also presents the anonymous id their browser used earlier, those anonymous answers
        /// become theirs (a pair they already answered while signed in keeps the signed-in answer).
        /// </summary>
        private async Task ClaimAnonymousVotes(Voter voter)
        {
            if (voter.UserId != null && voter.AnonymousId != null)
            {
                await _repository.ClaimAnonymousVotes(voter.UserId, voter.AnonymousId);
            }
        }

        private static (int, int) Canonical(int x, int y) => x < y ? (x, y) : (y, x);

        // ---------- Rating computation ----------

        private async Task<List<UnitRating>> GetRatingsOrBuild()
        {
            var ratings = await _repository.GetRatings();
            if (ratings.Count > 0) return ratings;

            await Recompute();
            return await _repository.GetRatings();
        }

        /// <summary>True when there are votes, games or new units the stored ratings do not reflect yet.</summary>
        public async Task<bool> NeedsRecompute()
        {
            var cardCount = (await _repository.GetRankableCards()).Count;
            if (await _repository.GetRatingCount() != cardCount) return true;

            var latestRating = await _repository.GetLatestRatingTime();
            if (latestRating == null || DateTime.UtcNow - latestRating > MaxRatingAge) return true;

            var latestVote = await _repository.GetLatestVoteTime();
            var latestGame = await _gameRepository.GetLatestGameTime();
            var latestChange = new[] { latestVote, latestGame }.Max();
            return latestChange != null && latestChange > latestRating;
        }

        public async Task Recompute()
        {
            await RecomputeLock.WaitAsync();
            try
            {
                var cards = await _repository.GetRankableCards();
                if (cards.Count == 0) return;

                var indexById = cards.Select((card, i) => (card.Id, i)).ToDictionary(x => x.Id, x => x.i);
                var seeds = ComputeSeeds(cards);

                // Duel votes
                var results = new List<BradleyTerry.Result>();
                var decisive = new int[cards.Count];
                var depends = new int[cards.Count];

                foreach (var vote in await _repository.GetAllVotes())
                {
                    if (!indexById.TryGetValue(vote.ArmyCardAId, out var ai) || !indexById.TryGetValue(vote.ArmyCardBId, out var bi)) continue;

                    if (vote.Result == UnitDuelVote.Depends)
                    {
                        depends[ai]++;
                        depends[bi]++;
                        continue;
                    }

                    var (winner, loser) = vote.Result == UnitDuelVote.PrefersA ? (ai, bi) : (bi, ai);
                    var weight = vote.UserId == null ? AnonymousVoteWeight : 1.0;
                    results.Add(new BradleyTerry.Result(winner, loser, weight));
                    decisive[ai]++;
                    decisive[bi]++;
                }

                // Logged games
                var (gameResults, gameCount, gameUsers) = await BuildGameEvidence(indexById, cards.Count);
                var qualified = Enumerable.Range(0, cards.Count)
                    .Select(i => gameCount[i] >= MinGamesForResults && gameUsers[i] >= MinPlayersForResults)
                    .ToArray();
                var counted = gameResults.Where(r => qualified[r.Unit]).ToList();

                var duelOnly = BradleyTerry.Solve(seeds, results);
                var combined = counted.Count == 0 ? duelOnly : BradleyTerry.Solve(seeds, results, counted);
                var resultsOnly = counted.Count == 0 ? null : BradleyTerry.Solve(seeds, Array.Empty<BradleyTerry.Result>(), counted);

                var now = DateTime.UtcNow;
                await _repository.SaveRatings(cards
                    .Select((card, i) => new UnitRating
                    {
                        ArmyCardId = card.Id,
                        Rating = combined[i],
                        DuelRating = duelOnly[i],
                        ResultsRating = qualified[i] ? resultsOnly?[i] : null,
                        SeedRating = seeds[i],
                        VoteCount = decisive[i],
                        DependsCount = depends[i],
                        GameCount = gameCount[i],
                        GameUserCount = gameUsers[i],
                        UpdatedAt = now,
                    })
                    .ToList());
            }
            finally
            {
                RecomputeLock.Release();
            }
        }

        /// <summary>
        /// Turns logged games into weighted results against "an average opponent for this player". A player's
        /// own win rate (nudged toward 50% until they have played a fair number of games) is the baseline, so a
        /// strong player's wins say less about their units. Each game's weight is split between its units by
        /// points share, and a single player's games count for at most <see cref="PlayerGameCap"/> games in total.
        /// </summary>
        private async Task<(List<BradleyTerry.FixedResult> Results, int[] GameCount, int[] UserCount)> BuildGameEvidence(
            Dictionary<int, int> indexById, int unitCount)
        {
            // Every unit stays in the game's points total so the units that are ranked get only their own share,
            // even when the army also held a unit that is not part of the ranking (such as a Marvel unit).
            var games = (await _gameRepository.GetAllGameUnits())
                .GroupBy(r => r.GameId)
                .Where(game => game.Any(r => indexById.ContainsKey(r.ArmyCardId)))
                .ToList();
            var perUser = games
                .GroupBy(g => g.First().UserId)
                .ToDictionary(
                    g => g.Key,
                    g =>
                    {
                        var total = g.Count();
                        var wins = g.Count(game => game.First().Won);
                        var winRate = (wins + PlayerBaselineGames / 2) / (total + PlayerBaselineGames);
                        return (Total: total, Baseline: Math.Log(winRate / (1 - winRate)));
                    });

            var results = new List<BradleyTerry.FixedResult>();
            var gameCount = new int[unitCount];
            var users = Enumerable.Range(0, unitCount).Select(_ => new HashSet<string>()).ToArray();

            foreach (var game in games)
            {
                var first = game.First();
                var user = perUser[first.UserId];
                var cap = Math.Min(1.0, (double)PlayerGameCap / user.Total);

                var totalPoints = game.Sum(r => (double)r.Quantity * r.Points);
                var totalWeight = totalPoints > 0 ? totalPoints : game.Sum(r => (double)r.Quantity);

                foreach (var row in game)
                {
                    if (!indexById.TryGetValue(row.ArmyCardId, out var index)) continue;

                    var contribution = totalPoints > 0 ? (double)row.Quantity * row.Points : row.Quantity;
                    var share = contribution / totalWeight;

                    // P(win) = 1 / (1 + e^(opponent - strength)), so an opponent of -baseline gives the player's baseline win rate.
                    results.Add(new BradleyTerry.FixedResult(index, -user.Baseline, share * cap * GameEvidenceScale, first.Won));
                    gameCount[index]++;
                    users[index].Add(first.UserId);
                }
            }

            return (results, gameCount, users.Select(u => u.Count).ToArray());
        }

        /// <summary>Starting strength per unit, centred so the median unit starts at 0.</summary>
        private static double[] ComputeSeeds(IReadOnlyList<RankableCard> cards)
        {
            var logPoints = cards.Select(c => Math.Log(Math.Max(c.Points, 1))).ToList();
            var ordered = logPoints.OrderBy(x => x).ToList();
            var median = ordered[ordered.Count / 2];
            return logPoints.Select(x => (x - median) / Math.Log(2) * SeedPerDoublingOfPoints).ToArray();
        }

        // ---------- Admin ----------

        /// <summary>
        /// Every unit's crowd position next to its points position, with the duel and results rankings shown
        /// separately. A large positive RankDelta means the unit ranks well above where its points put it.
        /// Only exposed to admins.
        /// </summary>
        public async Task<List<PowerBalanceRow>> GetBalanceReport()
        {
            var ratings = (await GetRatingsOrBuild()).ToDictionary(r => r.ArmyCardId);
            var cards = (await _repository.GetRankableCards()).Where(c => ratings.ContainsKey(c.Id)).ToList();

            var pointsRank = RankBy(cards, c => c.Points);
            var powerRank = RankBy(cards, c => ratings[c.Id].Rating);
            var duelRank = RankBy(cards, c => ratings[c.Id].DuelRating);

            var withResults = cards.Where(c => ratings[c.Id].ResultsRating != null).ToList();
            var resultsRank = RankBy(withResults, c => ratings[c.Id].ResultsRating!.Value);

            return cards
                .Select(c =>
                {
                    var rating = ratings[c.Id];
                    return new PowerBalanceRow
                    {
                        ArmyCardId = c.Id,
                        Name = c.Name,
                        Creator = c.Creator,
                        Points = c.Points,
                        PointsRank = pointsRank[c.Id],
                        PowerRank = powerRank[c.Id],
                        DuelRank = duelRank[c.Id],
                        ResultsRank = resultsRank.TryGetValue(c.Id, out var rr) ? rr : null,
                        RankDelta = pointsRank[c.Id] - powerRank[c.Id],
                        Rating = rating.Rating,
                        SeedRating = rating.SeedRating,
                        RatingDelta = rating.Rating - rating.SeedRating,
                        Votes = rating.VoteCount,
                        DependsVotes = rating.DependsCount,
                        Games = rating.GameCount,
                        GamePlayers = rating.GameUserCount,
                    };
                })
                .OrderByDescending(row => row.RatingDelta)
                .ToList();
        }

        /// <summary>1 = highest. Tied values share the better rank.</summary>
        private static Dictionary<int, int> RankBy(List<RankableCard> cards, Func<RankableCard, double> value)
        {
            var ordered = cards.OrderByDescending(value).ToList();
            var ranks = new Dictionary<int, int>();
            for (var i = 0; i < ordered.Count; i++)
            {
                ranks[ordered[i].Id] = i > 0 && value(ordered[i]) == value(ordered[i - 1]) ? ranks[ordered[i - 1].Id] : i + 1;
            }
            return ranks;
        }
    }
}
