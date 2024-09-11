using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private readonly UnitService _unitService;

        public UnitController(UnitService unitService)
        {
            _unitService = unitService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUnits()
        {
            var unit = await _unitService.GetAllUnits();
            return Ok(unit);
        }
    }
}
