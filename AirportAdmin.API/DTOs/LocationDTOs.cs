using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class CreateLocationRequest
{
    [Required] public string Name { get; set; } = string.Empty;
}

public class LocationResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
