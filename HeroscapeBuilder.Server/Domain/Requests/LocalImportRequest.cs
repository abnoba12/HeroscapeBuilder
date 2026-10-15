using HeroscapeBuilder.Server.Domain.Entities;

namespace HeroscapeBuilder.Server.Domain.Requests
{
    /// <summary>
    /// Everything a visitor saved in their browser's IndexedDB (which mirrors the user tables) before registering.
    /// Local ids only tie rows together inside this request; the server assigns the real ones.
    /// </summary>
    public class LocalImportRequest
    {
        public List<LocalImportCard> UserCards { get; set; } = new List<LocalImportCard>();

        public List<UserTerrainRequest> UserTerrain { get; set; } = new List<UserTerrainRequest>();

        public List<LocalImportArmy> Armies { get; set; } = new List<LocalImportArmy>();

        /// <summary>Results whose army was deleted locally; they are kept just as the database keeps them.</summary>
        public List<LocalImportGame> DetachedGames { get; set; } = new List<LocalImportGame>();
    }

    public class LocalImportCard
    {
        public int OwnedArmyCard { get; set; }

        public int Quantity { get; set; }
    }

    public class LocalImportArmy
    {
        public int LocalId { get; set; }

        /// <summary>The local id of the primary version when this is a point variation.</summary>
        public int? ParentLocalId { get; set; }

        public string? Name { get; set; }

        public string? VariationLabel { get; set; }

        public int PointLimit { get; set; }

        public PointSystem PointSystem { get; set; } = PointSystemExtensions.Default;

        public string? Creator { get; set; }

        public string? Notes { get; set; }

        public bool IsRetired { get; set; }

        public DateTime? RetiredAt { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<LocalImportUnit> Units { get; set; } = new List<LocalImportUnit>();

        public List<LocalImportJournalEntry> Journal { get; set; } = new List<LocalImportJournalEntry>();

        public List<LocalImportGame> Games { get; set; } = new List<LocalImportGame>();
    }

    public class LocalImportUnit
    {
        public int ArmyCardId { get; set; }

        public int Quantity { get; set; }
    }

    public class LocalImportJournalEntry
    {
        public DateOnly EntryDate { get; set; }

        public string? WentWell { get; set; }

        public string? WentPoorly { get; set; }

        public string? Notes { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }

    public class LocalImportGame
    {
        public bool Won { get; set; }

        public DateTime? PlayedAt { get; set; }

        public string? Note { get; set; }

        public DateTime? CreatedAt { get; set; }

        public List<LocalImportGameUnit> Units { get; set; } = new List<LocalImportGameUnit>();
    }

    public class LocalImportGameUnit
    {
        public int ArmyCardId { get; set; }

        public int Quantity { get; set; }

        public int Points { get; set; }
    }

    public class LocalImportResult
    {
        public int Cards { get; set; }

        public int Terrain { get; set; }

        public int Armies { get; set; }

        public int Games { get; set; }
    }
}
