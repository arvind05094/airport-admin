namespace AirportAdmin.API.Entities;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Crew";
    public int? JobRoleId { get; set; }
    public JobRole? JobRole { get; set; }
    public int? ConstraintProfileId { get; set; }
    public ConstraintProfile? ConstraintProfile { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
