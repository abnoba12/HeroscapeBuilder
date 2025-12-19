using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private readonly UnitService _unitService;
        private readonly ILogger<UnitController> _logger;

        public UnitController(UnitService unitService, ILogger<UnitController> logger)
        {
            _unitService = unitService;
            _logger = logger; 
        }

        [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any)]
        [HttpGet]
        public async Task<IActionResult> GetAllUnits()
        {
            var unit = await _unitService.GetAllUnits();
            return Ok(unit);
        }
    }
}
