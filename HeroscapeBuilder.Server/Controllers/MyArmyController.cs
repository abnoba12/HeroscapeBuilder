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
    public class MyArmyController : ControllerBase
    {
        public readonly MyArmyService _myArmyService;

        public MyArmyController(MyArmyService myArmyService)
        {
            _myArmyService = myArmyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyUnits()
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var unit = await _myArmyService.GetMyUnits(userId.Value);
            return Ok(unit);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyUnitCount()
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var count = await _myArmyService.GetMyUnitCount(userId.Value);
            return Ok(count);
        }

        [HttpPost]
        public async Task<IActionResult> AddUnitsToMyArmy(List<int> unitIds)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var added = await _myArmyService.AddUnitsToMyArmy(userId.Value, unitIds);
            return Ok(added);
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveUnitsFromMyArmy(List<int> unitIds)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var added = await _myArmyService.RemoveUnitsFromMyArmy(userId.Value, unitIds);
            return Ok(added);
        }

        [HttpGet]
        public async Task<IActionResult> GetCollectionShare()
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            return Ok(await _myArmyService.GetCollectionShare(userId.Value));
        }

        [HttpPut]
        public async Task<IActionResult> SetCollectionShared(bool isShared)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            return Ok(await _myArmyService.SetCollectionShared(userId.Value, isShared));
        }

        /// <summary>
        /// Public, read-only view of a shared collection. Anyone with the link can call this without signing in.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetSharedCollection(Guid shareId)
        {
            var units = await _myArmyService.GetSharedCollection(shareId);
            return units == null ? NotFound() : Ok(units);
        }

        [HttpPost]
        public async Task<IActionResult> SetMyUnits(List<MyArmyUpdateRequest> units)
        {
            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId == null)
            {
                return Unauthorized("User ID not found or invalid.");
            }

            var saved = await _myArmyService.SetMyUnits(userId.Value, units);
            return Ok(saved);
        }
    }
}
