using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileService _fileService;
        private readonly ImageOptimizationService _imageOptimizationService;

        public FileController(FileService fileService, ImageOptimizationService imageOptimizationService)
        {
            _fileService = fileService;
            _imageOptimizationService = imageOptimizationService;
        }

        [HttpGet]
        public async Task<List<UnitFileEntity>> GetFilesByPurposeAsync(string purpose)
        {
            return await _fileService.GetFilesByPurpose(purpose);
        }

        [HttpPut]
        public async Task<IActionResult> OptmizeImages(string Bucket, string Folder, string Purpose = "PRINT", int? MaxWidth = null, int? MaxHeight = null)
        {
            var optImgs = await _imageOptimizationService.OptimizeImagesAsync(Bucket, Folder, Purpose, MaxWidth, MaxHeight);

            if (optImgs != null && optImgs.Count > 0)
            {
                return Ok(optImgs);
            }

            return StatusCode(500, "Failed to optimize images.");
        }
    }
}
