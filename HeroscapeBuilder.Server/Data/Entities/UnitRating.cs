namespace HeroscapeBuilder.Server.Data.Entities;

public partial class UnitRating
{
    public int ArmyCardId { get; set; }

    /// <summary>The combined strength: duel votes plus (once there are enough) logged game results.</summary>
    public double Rating { get; set; }

    /// <summary>Strength from duel votes alone.</summary>
    public double DuelRating { get; set; }

    /// <summary>Strength from logged game results alone; null until the unit has enough games from enough players.</summary>
    public double? ResultsRating { get; set; }

    public int GameCount { get; set; }

    public int GameUserCount { get; set; }

    public double SeedRating { get; set; }

    /// <summary>Votes that picked a side; these are what Rating is built from.</summary>
    public int VoteCount { get; set; }

    public int DependsCount { get; set; }

    public DateTime UpdatedAt { get; set; }
}
