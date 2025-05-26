using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class ApplyShiftCoverRequest
{
    [Required] public int ShiftAssignmentId { get; set; }
    [Required] public string Reason { get; set; } = string.Empty;
}

public class ApproveShiftCoverRequest
{
    [Required] public int CoveredById { get; set; }
}

public class ShiftCoverResponse
{
    public int Id { get; set; }
    public int RequesterId { get; set; }
    public string RequesterFullName { get; set; } = string.Empty;
    public int? CoveredById { get; set; }
    public string? CoveredByFullName { get; set; }
    public int ShiftAssignmentId { get; set; }
    public DateOnly ShiftDate { get; set; }
    public TimeOnly ShiftStartTime { get; set; }
    public TimeOnly ShiftEndTime { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}