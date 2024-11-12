using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Security.Claims;
using System.Text;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileService _fileService;
        private readonly ImageService _imageOptimizationService;

        public FileController(FileService fileService, ImageService imageOptimizationService)
        {
            _fileService = fileService;
            _imageOptimizationService = imageOptimizationService;
        }

        [HttpGet]
        public async Task<List<UnitFileEntity>> GetFilesByPurposeAsync(string purpose)
        {            
            return await _fileService.GetFilesByPurpose(purpose);
        }

        [RequestSizeLimit(100 * 1024 * 1024)] // 100 MB limit
        [ApiKeyAuthorize]
        [HttpPut]
        public async Task<IActionResult> AddFileToUnit(int armyCardId, string filePurpose, string fileName, long? parentFileId)
        {
            try
            {
                // Check if there is any file in the request
                if (Request.Form.Files.Count == 0)
                {
                    return BadRequest("No file uploaded");
                }

                var file = Request.Form.Files[0];

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Invalid file");
                }

                // Example: Read file content into a memory stream
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    var fileData = stream.ToArray();
                    var success = await _fileService.AddFileToUnit(armyCardId, filePurpose, fileName, fileData, parentFileId);
                    if (success)
                    {
                        return Ok("File added successfully");
                    }
                }

                return BadRequest("Unkown status");
                
            }catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [ApiKeyAuthorize]
        [HttpPut]
        public async Task<IActionResult> OptmizeImages(string Bucket, string Folder, string Purpose = "PRINT", int? MaxWidth = null, int? MaxHeight = null)
        {
            var optImgs = await _imageOptimizationService.OptimizeImagesInStorageAsync(Bucket, Folder, Purpose, MaxWidth, MaxHeight);

            if (optImgs != null && optImgs.Count > 0)
            {
                return Ok(optImgs);
            }

            return StatusCode(500, "Failed to optimize images.");
        }
    }
}
