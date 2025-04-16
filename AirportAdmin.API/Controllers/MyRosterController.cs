using AirportAdmin.API.Helpers;
using AirportAdmin.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirportAdmin.API.Controllers;

[ApiController]
[Route("api/my/roster")]
[Authorize]
public class MyRosterController(RosterService rosterService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMyAssignments()
    {
        var userId = JwtHelper.GetUserId(HttpContext);
        return Ok(await rosterService.GetMyAssignmentsAsync(userId));
    }
}
