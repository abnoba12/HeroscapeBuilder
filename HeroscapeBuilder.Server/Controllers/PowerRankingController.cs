using HeroscapeBuilder.Server.Common.Helpers;
using HeroscapeBuilder.Server.Data.Models;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PowerRankingController : ControllerBase
    {
        /// <summary>Header carrying the random id a browser keeps for anonymous duels.</summary>
        public const string VisitorIdHeader = "X-Visitor-Id";

        private readonly PowerRankingService _powerRankingService;

        public PowerRankingController(PowerRankingService powerRankingService)
        {
            _powerRankingService = powerRankingService;
        }

        /// <summary>Public: every unit's place in the ranking.</summary>
        [AllowAnonymous]
        [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Any)]
        [HttpGet]
        public async Task<IActionResult> GetRankings()
        {
            return Ok(await _powerRankingService.GetRankings());
        }

        /// <summary>
        /// The next pair to compare. Open to everyone: signed-in users are recognised by their token, anyone else by
        /// their visitor id. 204 when the voter has answered every pair on offer.
        /// </summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetNextDuel()
        {
            var voter = ResolveVoter();
            if (voter == null)
            {
                return BadRequest(new { errors = new[] { "A visitor id is required." } });
            }

            var duel = await _powerRankingService.GetNextDuel(voter);
            return duel == null ? NoContent() : Ok(duel);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Vote(DuelVoteRequest request)
        {
            var voter = ResolveVoter();
            if (voter == null)
            {
                return BadRequest(new { errors = new[] { "A visitor id is required." } });
            }

            try
            {
                await _powerRankingService.Vote(voter, request);
                return Ok();
            }
            catch (PowerRankingException ex)
            {
                var body = new { errors = new[] { ex.Message } };
                return ex.TooManyRequests ? StatusCode(StatusCodes.Status429TooManyRequests, body) : BadRequest(body);
            }
        }

        /// <summary>Admin only: how the crowd's ranking compares with the ranking the points imply.</summary>
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetBalanceReport()
        {
            return Ok(await _powerRankingService.GetBalanceReport());
        }

        /// <summary>
        /// A signed-in user is identified by their token (and may also send the visitor id so earlier anonymous
        /// answers can be merged into their account). Anyone else needs a well-formed visitor id.
        /// </summary>
        private Voter? ResolveVoter()
        {
            var anonymousId = Guid.TryParse(Request.Headers[VisitorIdHeader].FirstOrDefault(), out var parsed)
                ? parsed.ToString("N")
                : null;

            var userId = UserHelper.GetCurrentUserId(HttpContext);
            if (userId != null)
            {
                return new Voter(userId.Value.ToString(), anonymousId);
            }

            return anonymousId == null ? null : new Voter(null, anonymousId);
        }
    }
}
