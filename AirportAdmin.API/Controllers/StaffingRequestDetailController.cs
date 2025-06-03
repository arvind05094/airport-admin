using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/staffing-requests")]
[Authorize]
public class StaffingRequestDetailController(StaffingRequestService staffingRequestService) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var role = JwtHelper.GetRole(HttpContext);
        var (result, error) = await staffingRequestService.GetDetailAsync(id, userId, role);
        if (error != null) return NotFound(new { message = error });
        return Ok(result);
    }
}