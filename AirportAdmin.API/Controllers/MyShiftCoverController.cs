using AirportAdmin.API.DTOs;
using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/my/shift-cover")]
[Authorize]
public class MyShiftCoverController(ShiftCoverService shiftCoverService) : ControllerBase
{
    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromBody] ApplyShiftCoverRequest request)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (result, error) = await shiftCoverService.ApplyAsync(userId, request);
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyRequests()
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        return Ok(await shiftCoverService.GetMyRequestsAsync(userId));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var (success, error) = await shiftCoverService.CancelAsync(id, userId);
        if (error != null) return BadRequest(new { message = error });
        return NoContent();
    }
}
