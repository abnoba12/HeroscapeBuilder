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
