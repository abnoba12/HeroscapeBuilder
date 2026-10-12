namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class JournalEntryEntity
    {
        public int Id { get; set; }

        public DateOnly EntryDate { get; set; }

        public string? WentWell { get; set; }

        public string? WentPoorly { get; set; }

        public string? Notes { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class JournalEntryRequest
    {
        /// <summary>Defaults to today (UTC) when omitted.</summary>
        public DateOnly? EntryDate { get; set; }

        public string? WentWell { get; set; }

        public string? WentPoorly { get; set; }

        public string? Notes { get; set; }
    }
}
