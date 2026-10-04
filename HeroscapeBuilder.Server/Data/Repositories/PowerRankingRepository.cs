using EFCoreSecondLevelCacheInterceptor;
using HeroscapeBuilder.Server.Data.Entities;
using HeroscapeBuilder.Server.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace HeroscapeBuilder.Server.Data.Repositories
{
    /// <summary>
    /// Votes and ratings change constantly, so every read here is NotCacheable (the EF second level cache
    /// would otherwise serve results for hours).
    /// </summary>
    public class PowerRankingRepository
    {
        private readonly HsbDbContext _context;

        public PowerRankingRepository(HsbDbContext context)
        {
            _context = context;
        }

        /// <summary>Every unit with its Renegade points (Standard when there is no override).</summary>
        public async Task<List<RankableCard>> GetRankableCards()
        {
            return await _context.ArmyCards
                .NotCacheable()
                .AsNoTracking()
                .Where(x => x.PointValues != null)
                .Select(x => new RankableCard(x.Id, x.Name, x.Creator, x.PointValues!.RenegadePoints ?? x.PointValues.StandardPoints))
                .ToListAsync();
        }

        public async Task<List<UnitDuelVote>> GetAllVotes()
        {
            return await _context.UnitDuelVotes.NotCacheable().AsNoTracking().ToListAsync();
        }

        public async Task<List<UnitRating>> GetRatings()
        {
            return await _context.UnitRatings.NotCacheable().AsNoTracking().ToListAsync();
        }

        public async Task<DateTime?> GetLatestVoteTime()
        {
            return await _context.UnitDuelVotes.NotCacheable().MaxAsync(x => (DateTime?)x.UpdatedAt);
        }

        public async Task<DateTime?> GetLatestRatingTime()
        {
            return await _context.UnitRatings.NotCacheable().MaxAsync(x => (DateTime?)x.UpdatedAt);
        }

        public async Task<int> GetRatingCount()
        {
            return await _context.UnitRatings.NotCacheable().CountAsync();
        }

        private IQueryable<UnitDuelVote> ForVoter(Voter voter)
        {
            var votes = _context.UnitDuelVotes.NotCacheable();
            return voter.UserId != null
                ? votes.Where(x => x.UserId == voter.UserId)
                : votes.Where(x => x.AnonymousId == voter.AnonymousId);
        }

        /// <summary>The pairs (A id, B id) this voter has already answered.</summary>
        public async Task<HashSet<(int, int)>> GetVotedPairs(Voter voter)
        {
            var pairs = await ForVoter(voter)
                .AsNoTracking()
                .Select(x => new { x.ArmyCardAId, x.ArmyCardBId })
                .ToListAsync();
            return pairs.Select(x => (x.ArmyCardAId, x.ArmyCardBId)).ToHashSet();
        }

        public async Task<int> CountVotesSince(Voter voter, DateTime sinceUtc)
        {
            return await ForVoter(voter).CountAsync(x => x.UpdatedAt >= sinceUtc);
        }

        public async Task<bool> CardsExist(int a, int b)
        {
            var found = await _context.ArmyCards.NotCacheable().CountAsync(x => x.Id == a || x.Id == b);
            return found == 2;
        }

        /// <summary>Inserts the vote, or replaces this voter's earlier answer for the same pair.</summary>
        public async Task SaveVote(Voter voter, int a, int b, byte result)
        {
            var now = DateTime.UtcNow;
            var existing = await ForVoter(voter)
                .FirstOrDefaultAsync(x => x.ArmyCardAId == a && x.ArmyCardBId == b);

            if (existing == null)
            {
                _context.UnitDuelVotes.Add(new UnitDuelVote
                {
                    UserId = voter.UserId,
                    AnonymousId = voter.UserId == null ? voter.AnonymousId : null,
                    ArmyCardAId = a,
                    ArmyCardBId = b,
                    Result = result,
                    CreatedAt = now,
                    UpdatedAt = now,
                });
            }
            else
            {
                existing.Result = result;
                existing.UpdatedAt = now;
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Hands the anonymous visitor's answers to the user they just signed in as. A pair the user already
        /// answered keeps the user's answer and the anonymous duplicate is dropped.
        /// </summary>
        public async Task ClaimAnonymousVotes(string userId, string anonymousId)
        {
            var anonymous = await _context.UnitDuelVotes.NotCacheable().Where(x => x.AnonymousId == anonymousId).ToListAsync();
            if (anonymous.Count == 0) return;

            var owned = await GetVotedPairs(new Voter(userId, null));
            var now = DateTime.UtcNow;

            foreach (var vote in anonymous)
            {
                if (owned.Contains((vote.ArmyCardAId, vote.ArmyCardBId)))
                {
                    _context.UnitDuelVotes.Remove(vote);
                    continue;
                }

                vote.UserId = userId;
                vote.AnonymousId = null;
                vote.UpdatedAt = now;
            }

            await _context.SaveChangesAsync();
        }

        /// <summary>Writes the freshly computed ratings: updates existing rows, adds new units, drops units that are gone.</summary>
        public async Task SaveRatings(IReadOnlyCollection<UnitRating> ratings)
        {
            var existing = (await _context.UnitRatings.NotCacheable().ToListAsync()).ToDictionary(x => x.ArmyCardId);
            var keep = ratings.Select(x => x.ArmyCardId).ToHashSet();

            foreach (var rating in ratings)
            {
                if (existing.TryGetValue(rating.ArmyCardId, out var row))
                {
                    row.Rating = rating.Rating;
                    row.DuelRating = rating.DuelRating;
                    row.ResultsRating = rating.ResultsRating;
                    row.GameCount = rating.GameCount;
                    row.GameUserCount = rating.GameUserCount;
                    row.SeedRating = rating.SeedRating;
                    row.VoteCount = rating.VoteCount;
                    row.DependsCount = rating.DependsCount;
                    row.UpdatedAt = rating.UpdatedAt;
                }
                else
                {
                    _context.UnitRatings.Add(rating);
                }
            }

            _context.UnitRatings.RemoveRange(existing.Values.Where(x => !keep.Contains(x.ArmyCardId)));
            await _context.SaveChangesAsync();
        }
    }
}
