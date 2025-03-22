using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/shift-cover")]
[Authorize(Roles = "Admin")]
public class AdminShiftCoverController(ShiftCoverService shiftCoverService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await shiftCoverService.GetAllAsync());

    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var (result, error) = await shiftCoverService.UpdateStatusAsync(id, "Approved");
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }

    [HttpPut("{id}/reject")]
    public async Task<IActionResult> Reject(int id)
    {
        var (result, error) = await shiftCoverService.UpdateStatusAsync(id, "Rejected");
        if (error != null) return BadRequest(new { message = error });
        return Ok(result);
    }
}
