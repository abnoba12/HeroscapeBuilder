namespace HeroscapeBuilder.Server.Data.Entities;

public partial class Set
{
    public long Id { get; set; }

    public string Creator { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Wave { get; set; }

    public DateOnly? ReleaseDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? Type { get; set; }

    public long? UnitsInSet { get; set; }

    public virtual ICollection<ArmyCard> ArmyCards { get; set; } = new List<ArmyCard>();

    public virtual Creator CreatorNavigation { get; set; } = null!;

    public virtual ICollection<SetTerrain> SetTerrains { get; set; } = new List<SetTerrain>();
}
