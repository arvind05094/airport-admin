using AirportAdmin.API.DTOs;
using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/my/leaves")]
[Authorize]
public class MyLeaveController(LeaveService leaveService) : ControllerBase
{
    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromBody] ApplyLeaveRequest request)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (result, error) = await leaveService.ApplyAsync(userId, request);
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyLeaves()
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        return Ok(await leaveService.GetMyLeavesAsync(userId));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (success, error) = await leaveService.CancelAsync(id, userId);
        if (error != null) return BadRequest(new { message = error });
        return NoContent();
    }
}
