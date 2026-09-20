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
    public class BattlegroupController : ControllerBase
    {
        private readonly BattlegroupService _battlegroupService;

        public BattlegroupController(BattlegroupService battlegroupService)
        {
            _battlegroupService = battlegroupService;
        }

        [HttpGet]
        public Task<IActionResult> GetMyBattlegroups()
        {
            return Run(userId => _battlegroupService.GetMyBattlegroups(userId));
        }

        [HttpGet]
        public Task<IActionResult> GetBattlegroup(int id)
        {
            return Run(userId => _battlegroupService.GetMyBattlegroup(userId, id));
        }

        [HttpPost]
        public Task<IActionResult> CreateBattlegroup(BattlegroupSaveRequest request)
        {
            return Run(userId => _battlegroupService.CreateBattlegroup(userId, request));
        }

        [HttpPut]
        public Task<IActionResult> UpdateBattlegroup(int id, BattlegroupSaveRequest request)
        {
            return Run(userId => _battlegroupService.UpdateBattlegroup(userId, id, request));
        }

        [HttpDelete]
        public Task<IActionResult> DeleteBattlegroup(int id)
        {
            return Run(async userId =>
            {
                await _battlegroupService.DeleteBattlegroup(userId, id);
                return true;
            });
        }

        [HttpPost]
        public Task<IActionResult> ShareBattlegroup(int id)
        {
            return Run(userId => _battlegroupService.SetShared(userId, id, true));
        }

        [HttpPost]
        public Task<IActionResult> HideBattlegroup(int id)
        {
            return Run(userId => _battlegroupService.SetShared(userId, id, false));
        }

        /// <summary>
        /// Public, read-only view of a shared battlegroup. Anyone with the link can call this without signing in;
        /// a signed-in owner is recognised so the page can offer them edit controls.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetSharedBattlegroup(Guid shareId)
        {
            try
            {
                var viewerId = UserHelper.GetCurrentUserId(HttpContext);
                return Ok(await _battlegroupService.GetSharedBattlegroup(shareId, viewerId));
            }
            catch (BattlegroupException ex)
            {
                return ToResult(ex);
            }
        }

        private async Task<IActionResult> Run<T>(Func<Guid, Task<T>> action)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            try
            {
                return Ok(await action(userId.Value));
            }
            catch (BattlegroupException ex)
            {
                return ToResult(ex);
            }
        }

        private IActionResult ToResult(BattlegroupException ex)
        {
            var body = new { errors = ex.Errors };
            return ex.Kind switch
            {
                BattlegroupErrorKind.NotFound => NotFound(body),
                BattlegroupErrorKind.Conflict => Conflict(body),
                _ => BadRequest(body),
            };
        }
    }
}
