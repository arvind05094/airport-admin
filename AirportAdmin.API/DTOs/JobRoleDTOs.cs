using System.ComponentModel.DataAnnotations;

namespace AirportAdmin.API.DTOs;

public class CreateJobRoleRequest
{
    [Required] public string Name { get; set; } = string.Empty;
}

public class JobRoleResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
