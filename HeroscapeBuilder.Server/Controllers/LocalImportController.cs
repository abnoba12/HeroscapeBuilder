using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Roles = "Admin,User")]
    public class LocalImportController : ControllerBase
    {
        private readonly LocalImportService _localImportService;

        public LocalImportController(LocalImportService localImportService)
        {
            _localImportService = localImportService;
        }

        /// <summary>Moves My Heroscape data a visitor kept in their browser into their account.</summary>
        [HttpPost]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> ImportLocalData(LocalImportRequest request)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            try
            {
                return Ok(await _localImportService.Import(userId.Value, request));
            }
            catch (ArmyBuilderException ex)
            {
                return BadRequest(new { errors = ex.Errors });
            }
        }
    }
}
