using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Mvc;
using NLog;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]")]
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

        [HttpGet]
        public async Task<IActionResult> GetAllUnits()
        {
            var unit = await _unitService.GetAllUnits();
            return Ok(unit);
        }
    }
}
