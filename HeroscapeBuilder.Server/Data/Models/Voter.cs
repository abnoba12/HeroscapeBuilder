namespace HeroscapeBuilder.Server.Data.Models
{
    /// <summary>Who is dueling: a signed-in user, or an anonymous visitor identified by the id their browser holds.</summary>
    public record Voter(string? UserId, string? AnonymousId)
    {
        public bool IsAnonymous => UserId == null;
    }
}
