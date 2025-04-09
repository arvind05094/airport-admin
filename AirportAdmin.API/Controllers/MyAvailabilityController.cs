using AirportAdmin.API.DTOs;
using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/my/availability")]
[Authorize]
public class MyAvailabilityController(AvailabilityService availabilityService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Set([FromBody] SetAvailabilityRequest request)
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        var result = await availabilityService.SetAsync(userId, request);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAvailability()
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        return Ok(await availabilityService.GetMyAvailabilityAsync(userId));
    }
}
