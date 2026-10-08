using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    /// <summary>Browsing maps is public; uploading, editing and deleting them is for administrators.</summary>
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

        /// <summary>Creators, terrain types and terrain sizes that the map list filters and the upload form offer.</summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetOptions()
        {
            return Ok(await _mapService.GetOptions());
        }

        /// <summary>Every map with its tiles. The list is small, so the page filters and sorts it client-side.</summary>
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMaps()
        {
            return Ok(await _mapService.GetMaps());
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMap(int id)
        {
            var map = await _mapService.GetMap(id);
            return map == null ? NotFound() : Ok(map);
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

        /// <summary>Same form as AddMap; the PDF and thumbnail are optional and keep the stored file when left out.</summary>
        [RequestSizeLimit(100 * 1024 * 1024)] // 100 MB limit
        [RequestFormLimits(MultipartBodyLengthLimit = 100 * 1024 * 1024)]
        [HttpPut]
        public async Task<IActionResult> UpdateMap(int id, [FromForm] MapUploadRequest request)
        {
            try
            {
                var map = await _mapService.UpdateMap(id, request);
                return map == null ? NotFound() : Ok(map);
            }
            catch (MapException ex)
            {
                return BadRequest(new { errors = ex.Errors });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMap(int id)
        {
            return await _mapService.DeleteMap(id) ? NoContent() : NotFound();
        }
    }
}
