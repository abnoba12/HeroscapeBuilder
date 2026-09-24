using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HeroscapeBuilder.Server.Controllers
{
    /// <summary>
    /// Customer-facing shop. Browsing and checkout work without an account; a signed-in customer's orders are
    /// linked to their account.
    /// </summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ShopController : ShopControllerBase
    {
        private readonly ShopService _shopService;
        private readonly ShopCheckoutService _checkoutService;

        public ShopController(ShopService shopService, ShopCheckoutService checkoutService)
        {
            _shopService = shopService;
            _checkoutService = checkoutService;
        }

        [HttpGet]
        public Task<IActionResult> GetCatalog()
        {
            return Run(() => _shopService.GetCatalog());
        }

        /// <summary>
        /// Prices a cart. Used by the cart page so the totals shown always match what checkout will charge.
        /// </summary>
        [HttpPost]
        public Task<IActionResult> GetQuote(ShopCartRequest request)
        {
            return Run(() => _shopService.GetQuote(request));
        }

        /// <summary>
        /// Creates the order and returns the Stripe checkout page URL to redirect to.
        /// </summary>
        [HttpPost]
        public Task<IActionResult> CreateCheckout(ShopCartRequest request)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            var email = userId == null ? null : User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
            return Run(() => _checkoutService.CreateCheckout(request, userId, email));
        }

        /// <summary>
        /// Called by the page Stripe returns to after payment. The session id is only known to the paying customer.
        /// </summary>
        [HttpGet]
        public Task<IActionResult> CompleteCheckout(string sessionId)
        {
            return Run(() => _checkoutService.CompleteCheckout(sessionId));
        }

        /// <summary>
        /// Order status page. The access key is the unguessable id in the link given to the customer after checkout.
        /// </summary>
        [HttpGet]
        public Task<IActionResult> GetOrder(Guid accessKey)
        {
            return Run(() => _shopService.GetOrder(accessKey));
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }
            return await Run(() => _shopService.GetMyOrders(userId.Value));
        }
    }
}
