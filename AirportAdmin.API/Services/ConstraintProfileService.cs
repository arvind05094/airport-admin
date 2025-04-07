using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class ConstraintProfileService(AppDbContext db)
{
    public async Task<List<ConstraintProfileResponse>> GetAllAsync() =>
        await db.ConstraintProfiles.Select(c => ToResponse(c)).ToListAsync();

    public async Task<ConstraintProfileResponse?> GetByIdAsync(int id) =>
        await db.ConstraintProfiles.Where(c => c.Id == id).Select(c => ToResponse(c)).FirstOrDefaultAsync();

    public async Task<(ConstraintProfileResponse? result, string? error)> CreateAsync(CreateConstraintProfileRequest request)
    {
        if (await db.ConstraintProfiles.AnyAsync(c => c.Name == request.Name))
            return (null, "Constraint profile with this name already exists.");

        var profile = new ConstraintProfile
        {
            Name = request.Name,
            MaxHoursPerDay = request.MaxHoursPerDay,
            MaxHoursPerWeek = request.MaxHoursPerWeek,
            MaxConsecutiveDays = request.MaxConsecutiveDays
        };

        db.ConstraintProfiles.Add(profile);
        await db.SaveChangesAsync();
        return (ToResponse(profile), null);
    }

    public async Task<ConstraintProfileResponse?> UpdateAsync(int id, UpdateConstraintProfileRequest request)
    {
        var profile = await db.ConstraintProfiles.FindAsync(id);
        if (profile == null) return null;

        if (request.Name != null) profile.Name = request.Name;
        if (request.MaxHoursPerDay.HasValue) profile.MaxHoursPerDay = request.MaxHoursPerDay.Value;
        if (request.MaxHoursPerWeek.HasValue) profile.MaxHoursPerWeek = request.MaxHoursPerWeek.Value;
        if (request.MaxConsecutiveDays.HasValue) profile.MaxConsecutiveDays = request.MaxConsecutiveDays.Value;

        await db.SaveChangesAsync();
        return ToResponse(profile);
    }

    public async Task<(bool success, string? error)> DeleteAsync(int id)
    {
        var profile = await db.ConstraintProfiles.FindAsync(id);
        if (profile == null) return (false, "Constraint profile not found.");

        db.ConstraintProfiles.Remove(profile);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static ConstraintProfileResponse ToResponse(ConstraintProfile c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        MaxHoursPerDay = c.MaxHoursPerDay,
        MaxHoursPerWeek = c.MaxHoursPerWeek,
        MaxConsecutiveDays = c.MaxConsecutiveDays
    };
}
