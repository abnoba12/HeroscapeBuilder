using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Roles = "Admin,User")]
    public class UserTerrainController : ControllerBase
    {
        private readonly UserTerrainService _userTerrainService;

        public UserTerrainController(UserTerrainService userTerrainService)
        {
            _userTerrainService = userTerrainService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyTerrain()
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            return Ok(await _userTerrainService.GetMyTerrain(userId.Value));
        }

        [HttpPost]
        public async Task<IActionResult> SetMyTerrain(List<UserTerrainRequest> terrain)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            try
            {
                return Ok(await _userTerrainService.SetMyTerrain(userId.Value, terrain));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
