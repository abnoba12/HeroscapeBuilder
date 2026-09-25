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
    public class ProfileController : ControllerBase
    {
        private readonly ProfileService _profileService;

        public ProfileController(ProfileService profileService)
        {
            _profileService = profileService;
        }

        [HttpGet]
        public Task<IActionResult> GetProfile()
        {
            return Run(userId => _profileService.GetProfile(userId));
        }

        [HttpPut]
        public Task<IActionResult> SetPointSystem(SetPointSystemRequest request)
        {
            return Run(userId => _profileService.SetPointSystem(userId, request));
        }

        [HttpPost]
        public Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            return Run(async userId =>
            {
                var (token, refreshToken) = await _profileService.ChangePassword(userId, request);
                return new { token, refreshToken };
            });
        }

        [HttpPost]
        public Task<IActionResult> DeleteAccount(DeleteAccountRequest request)
        {
            return Run(async userId =>
            {
                await _profileService.DeleteAccount(userId, request);
                return true;
            });
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
            catch (ProfileException ex)
            {
                var body = new { errors = ex.Errors };
                return ex.Kind == ProfileErrorKind.NotFound ? NotFound(body) : BadRequest(body);
            }
        }
    }
}
