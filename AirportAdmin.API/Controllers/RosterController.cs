using AirportAdmin.API.DTOs;
using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
public class RosterController(RosterService rosterService) : ControllerBase
{
    [HttpPost("api/admin/roster/generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateRosterRequest request)
    {
        var (result, error) = await rosterService.GenerateAsync(request);
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpGet("api/admin/roster")]
    public async Task<IActionResult> GetAll() =>
        Ok(await rosterService.GetAllAsync());

    [HttpDelete("api/admin/roster/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, error) = await rosterService.DeleteAsync(id);
        if (error != null) return NotFound(new { message = error });
        return NoContent();
    }

    [HttpPost("api/admin/roster/generate/{staffingRequestId}")]
    public async Task<IActionResult> GenerateForRequest(int staffingRequestId)
    {
        var (result, error) = await rosterService.GenerateForRequestAsync(staffingRequestId);
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }
}
