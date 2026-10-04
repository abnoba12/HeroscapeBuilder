namespace HeroscapeBuilder.Server.Domain.Entities
{
    /// <summary>A unit's place in the power ranking (1 = strongest).</summary>
    public class UnitPowerRank
    {
        public int ArmyCardId { get; set; }

        public int Rank { get; set; }
    }

    public class PowerRankingSummary
    {
        /// <summary>Number of ranked units; the "of N" in "#35 of N".</summary>
        public int RankedCount { get; set; }

        public List<UnitPowerRank> Units { get; set; } = new();
    }

    /// <summary>Two units to compare. Deliberately carries no points or rating.</summary>
    public class DuelPair
    {
        public int ArmyCardAId { get; set; }

        public int ArmyCardBId { get; set; }
    }

    public class DuelVoteRequest
    {
        public int ArmyCardAId { get; set; }

        public int ArmyCardBId { get; set; }

        /// <summary>The preferred unit's id, or null for "it depends".</summary>
        public int? PreferredArmyCardId { get; set; }
    }

    /// <summary>Admin-only comparison of how the crowd ranks a unit against how its points rank it.</summary>
    public class PowerBalanceRow
    {
        public int ArmyCardId { get; set; }

        public string? Name { get; set; }

        public string? Creator { get; set; }

        public int Points { get; set; }

        public int PointsRank { get; set; }

        /// <summary>Rank by the combined rating (duels plus results); this is what the public ranking uses.</summary>
        public int PowerRank { get; set; }

        /// <summary>Rank by duel votes alone.</summary>
        public int DuelRank { get; set; }

        /// <summary>Rank by logged game results alone; null until the unit has enough games from enough players.</summary>
        public int? ResultsRank { get; set; }

        /// <summary>Points rank minus power rank: positive means the crowd rates the unit above what its points suggest.</summary>
        public int RankDelta { get; set; }

        public double Rating { get; set; }

        public double SeedRating { get; set; }

        public double RatingDelta { get; set; }

        public int Votes { get; set; }

        public int DependsVotes { get; set; }

        /// <summary>Logged games the unit appeared in, and how many different players logged them.</summary>
        public int Games { get; set; }

        public int GamePlayers { get; set; }
    }
}
