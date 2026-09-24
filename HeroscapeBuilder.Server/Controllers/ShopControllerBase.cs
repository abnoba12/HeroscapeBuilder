using HeroscapeBuilder.Server.Domain.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    /// <summary>
    /// Turns <see cref="ShopException"/> into the { errors: [...] } responses the shop pages expect.
    /// </summary>
    public abstract class ShopControllerBase : ControllerBase
    {
        protected async Task<IActionResult> Run<T>(Func<Task<T>> action)
        {
            try
            {
                return Ok(await action());
            }
            catch (ShopException ex)
            {
                return ToResult(ex);
            }
        }

        protected IActionResult ToResult(ShopException ex)
        {
            var body = new { errors = ex.Errors };
            return ex.Kind switch
            {
                ShopErrorKind.NotFound => NotFound(body),
                ShopErrorKind.Conflict => Conflict(body),
                ShopErrorKind.Unavailable => StatusCode(StatusCodes.Status503ServiceUnavailable, body),
                _ => BadRequest(body),
            };
        }
    }
}
