using Microsoft.AspNetCore.Identity;

namespace HeroscapeBuilder.Server.Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        // Navigation property for UserCards
        public virtual ICollection<UserCard> UserCards { get; set; } = new List<UserCard>();
    }
}
