using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class SetAvailabilityRequest
{
    [Required] public DateOnly Date { get; set; }
    [Required] public bool IsAvailable { get; set; }
}

public class AvailabilityResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public bool IsAvailable { get; set; }
}