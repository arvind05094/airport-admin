namespace AirportAdmin.API.Entities;

public class ConstraintProfile
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int MaxHoursPerDay { get; set; }
    public int MaxHoursPerWeek { get; set; }
    public int MaxConsecutiveDays { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
