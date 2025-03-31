using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/staffing-requests")]
[Authorize(Roles = "Admin")]
public class AdminStaffingRequestController(StaffingRequestService staffingRequestService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await staffingRequestService.GetAllAsync());

    [HttpPut("{id}/fulfil")]
    public async Task<IActionResult> Fulfil(int id)
    {
        var (result, error) = await staffingRequestService.FulfilAsync(id);
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }
}
