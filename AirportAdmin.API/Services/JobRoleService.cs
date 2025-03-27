using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class JobRoleService(AppDbContext db)
{
    public async Task<List<JobRoleResponse>> GetAllAsync() =>
        await db.JobRoles.Select(r => ToResponse(r)).ToListAsync();

    public async Task<(JobRoleResponse? result, string? error)> CreateAsync(CreateJobRoleRequest request)
    {
        if (await db.JobRoles.AnyAsync(r => r.Name == request.Name))
            return (null, "Job role already exists.");

        var role = new JobRole { Name = request.Name };
        db.JobRoles.Add(role);
        await db.SaveChangesAsync();
        return (ToResponse(role), null);
    }

    public async Task<(bool success, string? error)> DeleteAsync(int id)
    {
        var role = await db.JobRoles.FindAsync(id);
        if (role == null) return (false, "Job role not found.");

        db.JobRoles.Remove(role);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static JobRoleResponse ToResponse(JobRole r) => new()
    {
        Id = r.Id,
        Name = r.Name
    };
}
