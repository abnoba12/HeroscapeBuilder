using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileService _fileService;

        public FileController(FileService fileService)
        {
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<List<UnitFileEntity>> GetFilesByPurposeAsync(string purpose)
        {
            return await _fileService.GetFilesByPurpose(purpose);
        }
    }
}
