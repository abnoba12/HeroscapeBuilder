using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Domain.Entities;
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
    public class ArmyBuilderController : ControllerBase
    {
        private readonly ArmyBuilderService _armyBuilderService;
        private readonly ArmyGameService _armyGameService;
        private readonly ArmyBuilderJournalService _journalService;

        public ArmyBuilderController(ArmyBuilderService armyBuilderService, ArmyGameService armyGameService, ArmyBuilderJournalService journalService)
        {
            _armyBuilderService = armyBuilderService;
            _armyGameService = armyGameService;
            _journalService = journalService;
        }

        [HttpGet]
        public Task<IActionResult> GetMyArmyBuilders()
        {
            return Run(userId => _armyBuilderService.GetMyArmyBuilders(userId));
        }

        [HttpGet]
        public Task<IActionResult> GetArmyBuilder(int id)
        {
            return Run(userId => _armyBuilderService.GetMyArmyBuilder(userId, id));
        }

        [HttpPost]
        public Task<IActionResult> CreateArmyBuilder(ArmyBuilderSaveRequest request)
        {
            return Run(userId => _armyBuilderService.CreateArmyBuilder(userId, request));
        }

        [HttpPut]
        public Task<IActionResult> UpdateArmyBuilder(int id, ArmyBuilderSaveRequest request)
        {
            return Run(userId => _armyBuilderService.UpdateArmyBuilder(userId, id, request));
        }

        [HttpDelete]
        public Task<IActionResult> DeleteArmyBuilder(int id)
        {
            return Run(async userId =>
            {
                await _armyBuilderService.DeleteArmyBuilder(userId, id);
                return true;
            });
        }

        [HttpPost]
        public Task<IActionResult> ShareArmyBuilder(int id)
        {
            return Run(userId => _armyBuilderService.SetShared(userId, id, true));
        }

        [HttpPost]
        public Task<IActionResult> HideArmyBuilder(int id)
        {
            return Run(userId => _armyBuilderService.SetShared(userId, id, false));
        }

        [HttpPost]
        public Task<IActionResult> RetireArmyBuilder(int id)
        {
            return Run(userId => _armyBuilderService.SetRetired(userId, id, true));
        }

        [HttpPost]
        public Task<IActionResult> RestoreArmyBuilder(int id)
        {
            return Run(userId => _armyBuilderService.SetRetired(userId, id, false));
        }

        [HttpGet]
        public Task<IActionResult> GetJournal(int id)
        {
            return Run(userId => _journalService.GetJournal(userId, id));
        }

        [HttpPost]
        public Task<IActionResult> AddJournalEntry(int id, JournalEntryRequest request)
        {
            return Run(userId => _journalService.AddEntry(userId, id, request));
        }

        [HttpPut]
        public Task<IActionResult> UpdateJournalEntry(int entryId, JournalEntryRequest request)
        {
            return Run(userId => _journalService.UpdateEntry(userId, entryId, request));
        }

        [HttpDelete]
        public Task<IActionResult> DeleteJournalEntry(int entryId)
        {
            return Run(async userId =>
            {
                await _journalService.DeleteEntry(userId, entryId);
                return true;
            });
        }

        [HttpGet]
        public Task<IActionResult> GetGames(int id)
        {
            return Run(userId => _armyGameService.GetRecentGames(userId, id));
        }

        [HttpPost]
        public Task<IActionResult> LogGames(int id, ArmyGameRequest request)
        {
            return Run(userId => _armyGameService.LogGames(userId, id, request));
        }

        [HttpDelete]
        public Task<IActionResult> DeleteGame(int gameId)
        {
            return Run(userId => _armyGameService.DeleteGame(userId, gameId));
        }

        /// <summary>
        /// Public, read-only view of a shared army builder. Anyone with the link can call this without signing in;
        /// a signed-in owner is recognised so the page can offer them edit controls.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetSharedArmyBuilder(Guid shareId)
        {
            try
            {
                var viewerId = UserHelper.GetCurrentUserId(HttpContext);
                return Ok(await _armyBuilderService.GetSharedArmyBuilder(shareId, viewerId));
            }
            catch (ArmyBuilderException ex)
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
            catch (ArmyBuilderException ex)
            {
                return ToResult(ex);
            }
        }

        private IActionResult ToResult(ArmyBuilderException ex)
        {
            var body = new { errors = ex.Errors };
            return ex.Kind switch
            {
                ArmyBuilderErrorKind.NotFound => NotFound(body),
                ArmyBuilderErrorKind.Conflict => Conflict(body),
                _ => BadRequest(body),
            };
        }
    }
}
