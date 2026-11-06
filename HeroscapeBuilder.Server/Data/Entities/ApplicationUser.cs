using HeroscapeBuilder.Server.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace HeroscapeBuilder.Server.Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        /// <summary>
        /// The point system pages default to for this user.
        /// </summary>
        public PointSystem PointSystem { get; set; } = PointSystemExtensions.Default;
        /// <summary>
        /// Lets the Maps page count a tile of the same size and swap group in place of a tile the user lacks.
        /// </summary>
        public bool AllowTileSwap { get; set; } = true;
        /// <summary>
        /// Whether the link for this user's My Collection works for anyone who has it.
        /// </summary>
        public bool CollectionIsShared { get; set; }
        /// <summary>
        /// The secret in this user's My Collection link; only resolves while CollectionIsShared.
        /// </summary>
        public Guid CollectionShareId { get; set; } = Guid.NewGuid();
        // Navigation property for UserCards
        public virtual ICollection<UserCard> UserCards { get; set; } = new List<UserCard>();
    }
}
