using AirportAdmin.API.DTOs;
using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/my/staffing-requests")]
[Authorize(Roles = "Admin,Manager,Supervisor")]
public class MyStaffingRequestController(StaffingRequestService staffingRequestService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStaffingRequest request)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (results, error) = await staffingRequestService.CreateAsync(userId, request);
        if (error != null) return BadRequest(new { message = error });
        return Ok(results);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        return Ok(await staffingRequestService.GetMyRequestsAsync(userId));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (success, error) = await staffingRequestService.CancelAsync(id, userId);
        if (error != null) return BadRequest(new { message = error });
        return NoContent();
    }
}
