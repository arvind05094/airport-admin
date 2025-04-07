using AirportAdmin.API.DTOs;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/constraint-profiles")]
[Authorize(Roles = "Admin")]
public class ConstraintProfileController(ConstraintProfileService constraintProfileService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await constraintProfileService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await constraintProfileService.GetByIdAsync(id);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateConstraintProfileRequest request)
    {
        var (result, error) = await constraintProfileService.CreateAsync(request);
        if (error != null) return Conflict(new { message = error });
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateConstraintProfileRequest request)
    {
        var result = await constraintProfileService.UpdateAsync(id, request);
        return result == null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, error) = await constraintProfileService.DeleteAsync(id);
        if (error != null) return NotFound(new { message = error });
        return NoContent();
    }
}
