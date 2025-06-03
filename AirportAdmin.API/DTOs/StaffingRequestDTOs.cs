using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class CreateStaffingRequest
{
    [Required] public int LocationId { get; set; }
    [Required] public int JobRoleId { get; set; }
    [Required] public DateOnly StartDate { get; set; }
    [Required] public DateOnly EndDate { get; set; }
    [Required] public TimeOnly StartTime { get; set; }
    [Required] public TimeOnly EndTime { get; set; }
    [Range(1, int.MaxValue)] public int RequiredCount { get; set; }
}

public class StaffingRequestResponse
{
    public int Id { get; set; }
    public int CreatedById { get; set; }
    public string CreatedByFullName { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public int JobRoleId { get; set; }
    public string JobRoleName { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int RequiredCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
public class StaffingRequestDetailResponse
{
    public int Id { get; set; }
    public int CreatedById { get; set; }
    public string CreatedByFullName { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public int JobRoleId { get; set; }
    public string JobRoleName { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int RequiredCount { get; set; }
    public int AssignedCount { get; set; }
    public int UnfilledCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<ShiftAssignmentResponse> Assignments { get; set; } = [];
}
public class BulkCreateStaffingRequest
{
    [Required, MinLength(1)]
    public List<CreateStaffingRequest> Requests { get; set; } = [];
}