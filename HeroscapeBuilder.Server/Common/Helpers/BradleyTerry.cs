namespace HeroscapeBuilder.Server.Common.Helpers
{
    /// <summary>
    /// Bradley-Terry strengths from pairwise results, estimated as a MAP fit: every unit is pulled toward its
    /// seed strength by a Gaussian prior, so a unit with few votes stays near its seed and the fit is well
    /// defined even when the vote graph has disconnected pieces. P(i beats j) = 1 / (1 + e^(r_j - r_i)).
    /// </summary>
    public static class BradleyTerry
    {
        /// <summary>One decisive vote: unit index <see cref="Winner"/> was preferred over <see cref="Loser"/>.</summary>
        public readonly record struct Result(int Winner, int Loser, double Weight = 1.0);

        /// <summary>
        /// A weighted result of one unit against an opponent of known strength (used for logged games, where the
        /// opponent is "an average opponent for this player", not another unit).
        /// </summary>
        public readonly record struct FixedResult(int Unit, double OpponentRating, double Weight, bool Won);

        /// <param name="seeds">Starting strength of each unit (log scale); also the centre of the prior.</param>
        /// <param name="results">Decisive votes by unit index.</param>
        /// <param name="fixedResults">Results against opponents of known strength, or null.</param>
        /// <param name="priorStdDev">How far from its seed the votes may move a unit; smaller trusts the seed more.</param>
        public static double[] Solve(
            IReadOnlyList<double> seeds,
            IReadOnlyList<Result> results,
            IReadOnlyList<FixedResult>? fixedResults = null,
            double priorStdDev = 1.0,
            int maxSweeps = 200)
        {
            var count = seeds.Count;
            var rating = seeds.ToArray();
            var priorPrecision = 1.0 / (priorStdDev * priorStdDev);

            var opponents = new List<(int Other, double Wins, double Games)>[count];
            var fixedByUnit = new List<FixedResult>[count];
            for (var i = 0; i < count; i++)
            {
                opponents[i] = new();
                fixedByUnit[i] = new();
            }

            // Collapse repeated pairs into weighted (wins, games) per direction.
            foreach (var group in results.GroupBy(r => (Low: Math.Min(r.Winner, r.Loser), High: Math.Max(r.Winner, r.Loser))))
            {
                var games = group.Sum(r => r.Weight);
                var lowWins = group.Where(r => r.Winner == group.Key.Low).Sum(r => r.Weight);
                opponents[group.Key.Low].Add((group.Key.High, lowWins, games));
                opponents[group.Key.High].Add((group.Key.Low, games - lowWins, games));
            }

            if (fixedResults != null)
            {
                foreach (var result in fixedResults)
                {
                    fixedByUnit[result.Unit].Add(result);
                }
            }

            for (var sweep = 0; sweep < maxSweeps; sweep++)
            {
                var largestStep = 0.0;
                for (var i = 0; i < count; i++)
                {
                    var gradient = -priorPrecision * (rating[i] - seeds[i]);
                    var curvature = priorPrecision;

                    foreach (var (other, wins, games) in opponents[i])
                    {
                        var p = 1.0 / (1.0 + Math.Exp(rating[other] - rating[i]));
                        gradient += wins - games * p;
                        curvature += games * p * (1 - p);
                    }

                    foreach (var fixedResult in fixedByUnit[i])
                    {
                        var p = 1.0 / (1.0 + Math.Exp(fixedResult.OpponentRating - rating[i]));
                        gradient += fixedResult.Weight * ((fixedResult.Won ? 1.0 : 0.0) - p);
                        curvature += fixedResult.Weight * p * (1 - p);
                    }

                    // Clamped so one noisy unit cannot swing wildly in a single update.
                    var step = Math.Clamp(gradient / curvature, -1.0, 1.0);
                    rating[i] += step;
                    largestStep = Math.Max(largestStep, Math.Abs(step));
                }

                if (largestStep < 1e-6) break;
            }

            return rating;
        }
    }
}
