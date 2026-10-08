using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    /// <summary>Map management. Administrators only; viewing and downloading maps is a separate feature.</summary>
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class MapController : ControllerBase
    {
        private readonly MapService _mapService;

        public MapController(MapService mapService)
        {
            _mapService = mapService;
        }

        /// <summary>Creators, terrain types and terrain sizes that the upload form offers.</summary>
        [HttpGet]
        public async Task<IActionResult> GetOptions()
        {
            return Ok(await _mapService.GetOptions());
        }

        [RequestSizeLimit(100 * 1024 * 1024)] // 100 MB limit
        [RequestFormLimits(MultipartBodyLengthLimit = 100 * 1024 * 1024)]
        [HttpPost]
        public async Task<IActionResult> AddMap([FromForm] MapUploadRequest request)
        {
            try
            {
                return Ok(await _mapService.AddMap(request));
            }
            catch (MapException ex)
            {
                return BadRequest(new { errors = ex.Errors });
            }
        }
    }
}
