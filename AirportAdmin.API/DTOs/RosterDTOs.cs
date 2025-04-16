using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class GenerateRosterRequest
{
    [Required] public DateOnly StartDate { get; set; }
    [Required] public DateOnly EndDate { get; set; }
    public int? LocationId { get; set; }
    public int? JobRoleId { get; set; }
}

public class ShiftAssignmentResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public int StaffingRequestId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string JobRoleName { get; set; } = string.Empty;
}

public class RosterGenerationResult
{
    public int TotalAssignments { get; set; }
    public int UnfilledRequests { get; set; }
    public List<ShiftAssignmentResponse> Assignments { get; set; } = [];
}
