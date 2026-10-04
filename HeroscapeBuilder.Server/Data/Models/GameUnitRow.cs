namespace HeroscapeBuilder.Server.Data.Models
{
    /// <summary>One unit of one logged game, flattened for the rating computation.</summary>
    public record GameUnitRow(string UserId, int GameId, bool Won, int ArmyCardId, int Quantity, int Points);
}
