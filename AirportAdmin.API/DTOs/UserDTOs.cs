using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class CreateUserRequest
{
    [Required] public string FullName { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = "Crew";
    public int? JobRoleId { get; set; }
    public int? ConstraintProfileId { get; set; }
}

public class UpdateUserRequest
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Role { get; set; }
    public int? JobRoleId { get; set; }
    public int? ConstraintProfileId { get; set; }
}

public class UserResponse
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? JobRoleId { get; set; }
    public string? JobRoleName { get; set; }
    public int? ConstraintProfileId { get; set; }
    public string? ConstraintProfileName { get; set; }
    public DateTime CreatedAt { get; set; }
}
