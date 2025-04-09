namespace AirportAdmin.API.Entities;

public class StaffAvailability
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateOnly Date { get; set; }
    public bool IsAvailable { get; set; } = true;
}
