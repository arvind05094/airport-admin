namespace AirportAdmin.API.Entities;

public class ShiftCoverRequest
{
    public int Id { get; set; }
    public int RequesterId { get; set; }
    public User Requester { get; set; } = null!;
    public int? CoveredById { get; set; }
    public User? CoveredBy { get; set; }
    public DateOnly ShiftDate { get; set; }
    public TimeOnly ShiftStartTime { get; set; }
    public TimeOnly ShiftEndTime { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
