using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class CreateConstraintProfileRequest
{
    [Required] public string Name { get; set; } = string.Empty;
    [Range(1, 24)] public int MaxHoursPerDay { get; set; }
    [Range(1, 168)] public int MaxHoursPerWeek { get; set; }
    [Range(1, 7)] public int MaxConsecutiveDays { get; set; }
}

public class UpdateConstraintProfileRequest
{
    public string? Name { get; set; }
    public int? MaxHoursPerDay { get; set; }
    public int? MaxHoursPerWeek { get; set; }
    public int? MaxConsecutiveDays { get; set; }
}

public class ConstraintProfileResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int MaxHoursPerDay { get; set; }
    public int MaxHoursPerWeek { get; set; }
    public int MaxConsecutiveDays { get; set; }
}
