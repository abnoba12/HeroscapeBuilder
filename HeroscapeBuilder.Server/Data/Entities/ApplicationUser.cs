using Microsoft.AspNetCore.Identity;

namespace HeroscapeBuilder.Server.Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
        // Navigation property for UserCards
        public virtual ICollection<UserCard> UserCards { get; set; } = new List<UserCard>();
    }
}
