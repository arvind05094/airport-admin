using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/leaves")]
[Authorize(Roles = "Admin")]
public class AdminLeaveController(LeaveService leaveService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await leaveService.GetAllAsync());

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var (result, error) = await leaveService.UpdateStatusAsync(id, "Approved");
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var (result, error) = await leaveService.UpdateStatusAsync(id, "Rejected");
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }
}
