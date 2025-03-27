using AirportAdmin.API.DTOs;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/locations")]
public class LocationController(LocationService locationService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll() =>
        Ok(await locationService.GetAllAsync());

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateLocationRequest request)
    {
        var (result, error) = await locationService.CreateAsync(request);
        if (error != null) return Conflict(new { message = error });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, error) = await locationService.DeleteAsync(id);
        if (error != null) return NotFound(new { message = error });
        return NoContent();
    }
}
