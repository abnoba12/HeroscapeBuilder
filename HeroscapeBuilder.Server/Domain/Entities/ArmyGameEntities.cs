namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class ArmyGameEntity
    {
        public int Id { get; set; }

        public bool Won { get; set; }

        public DateTime PlayedAt { get; set; }

        public string? Note { get; set; }
    }

    public class ArmyTally
    {
        public int Wins { get; set; }

        public int Losses { get; set; }
    }

    public class ArmyGameRequest
    {
        public bool Won { get; set; }

        /// <summary>How many identical results to record at once (for entering past results). 1 for a single game.</summary>
        public int Count { get; set; } = 1;

        public DateTime? PlayedAt { get; set; }

        public string? Note { get; set; }
    }
}
