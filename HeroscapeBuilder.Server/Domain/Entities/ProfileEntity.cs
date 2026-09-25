namespace HeroscapeBuilder.Server.Domain.Entities
{
    public class ProfileEntity
    {
        public string Email { get; set; } = null!;

        /// <summary>
        /// The point system pages default to for this user.
        /// </summary>
        public PointSystem PointSystem { get; set; }
    }
}
