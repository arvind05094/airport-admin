using AirportAdmin.API.DTOs;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/job-roles")]
public class JobRoleController(JobRoleService jobRoleService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll() =>
        Ok(await jobRoleService.GetAllAsync());

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateJobRoleRequest request)
    {
        var (result, error) = await jobRoleService.CreateAsync(request);
        if (error != null) return Conflict(new { message = error });
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var (success, error) = await jobRoleService.DeleteAsync(id);
        if (error != null) return NotFound(new { message = error });
        return NoContent();
    }
}
