using System.Security.Claims;

namespace HeroscapeBuilder.Server.Common.Helpers
{
    public static class UserHelper
    {
        public static Guid? GetCurrentUserId(HttpContext httpContext)
        {
            if (httpContext == null) throw new ArgumentNullException(nameof(httpContext));

            var userIdClaim = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
            {
                return null; // Or throw an exception if needed
            }

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }

            return null; // Or throw an exception if needed
        }
    }
}
