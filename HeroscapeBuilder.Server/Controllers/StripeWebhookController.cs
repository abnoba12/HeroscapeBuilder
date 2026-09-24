using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace HeroscapeBuilder.Server.Controllers
{
    /// <summary>
    /// Receives Stripe webhook events at /api/StripeWebhook. Point the Stripe dashboard webhook endpoint (or
    /// "stripe listen --forward-to") here, subscribed to checkout.session.* and charge.refunded.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class StripeWebhookController : ControllerBase
    {
        private readonly ShopCheckoutService _checkoutService;
        private readonly ILogger<StripeWebhookController> _logger;

        public StripeWebhookController(ShopCheckoutService checkoutService, ILogger<StripeWebhookController> logger)
        {
            _checkoutService = checkoutService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Receive()
        {
            // The signature is computed over the exact raw body, so it must be read before anything parses it.
            using var reader = new StreamReader(Request.Body);
            var json = await reader.ReadToEndAsync();

            try
            {
                await _checkoutService.HandleWebhook(json, Request.Headers["Stripe-Signature"]);
                return Ok();
            }
            catch (StripeException ex) when (ex.StripeError == null)
            {
                // Signature failures come back without a StripeError; anything else is a failed API call.
                _logger.LogWarning(ex, "Rejected a Stripe webhook with an invalid signature.");
                return BadRequest();
            }
            catch (ShopException ex) when (ex.Kind == ShopErrorKind.Unavailable)
            {
                _logger.LogError("Stripe webhook received but {Reason}", ex.Message);
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
        }
    }
}
