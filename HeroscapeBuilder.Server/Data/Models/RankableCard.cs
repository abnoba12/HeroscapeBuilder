namespace HeroscapeBuilder.Server.Data.Models
{
    /// <summary>A unit as the power ranking sees it: its id and its Renegade points (Standard when there is no override).</summary>
    public record RankableCard(int Id, string? Name, string Creator, int Points);
}
