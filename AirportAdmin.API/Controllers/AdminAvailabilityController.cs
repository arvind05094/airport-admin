using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/admin/availability")]
[Authorize(Roles = "Admin")]
public class AdminAvailabilityController(AvailabilityService availabilityService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await availabilityService.GetAllAsync());
}
