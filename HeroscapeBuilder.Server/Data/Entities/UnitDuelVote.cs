namespace HeroscapeBuilder.Server.Data.Entities;

/// <summary>
/// One answer for one pair of units, from a signed-in user or an anonymous visitor (exactly one of
/// <see cref="UserId"/> and <see cref="AnonymousId"/> is set). The pair is stored in a canonical order (A id &lt; B id).
/// </summary>
public partial class UnitDuelVote
{
    public const byte Depends = 0;
    public const byte PrefersA = 1;
    public const byte PrefersB = 2;

    public int Id { get; set; }

    public string? UserId { get; set; }

    /// <summary>Random id kept in the visitor's browser; becomes a UserId if they sign in.</summary>
    public string? AnonymousId { get; set; }

    public int ArmyCardAId { get; set; }

    public int ArmyCardBId { get; set; }

    public byte Result { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
