namespace AirportAdmin.API.Entities;

public class ShiftAssignment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int StaffingRequestId { get; set; }
    public StaffingRequest StaffingRequest { get; set; } = null!;
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int LocationId { get; set; }
    public Location Location { get; set; } = null!;
    public int JobRoleId { get; set; }
    public JobRole JobRole { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
