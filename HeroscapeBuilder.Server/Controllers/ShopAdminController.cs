using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HeroscapeBuilder.Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ShopAdminController : ShopControllerBase
    {
        private readonly ShopAdminService _adminService;

        public ShopAdminController(ShopAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        public Task<IActionResult> GetOrders(string? status)
        {
            return Run(() => _adminService.GetOrders(status));
        }

        [HttpGet]
        public Task<IActionResult> GetOrder(int id)
        {
            return Run(() => _adminService.GetOrder(id));
        }

        [HttpPut]
        public Task<IActionResult> UpdateOrder(int id, ShopOrderUpdateRequest request)
        {
            return Run(() => _adminService.UpdateOrder(id, request));
        }

        [HttpPost]
        public Task<IActionResult> RefundOrder(int id)
        {
            return Run(() => _adminService.RefundOrder(id));
        }

        [HttpGet]
        public Task<IActionResult> GetSettings()
        {
            return Run(() => _adminService.GetSettings());
        }

        [HttpPut]
        public Task<IActionResult> SaveSettings(ShopSettingsSaveRequest request)
        {
            return Run(() => _adminService.SaveSettings(request));
        }
    }
}
