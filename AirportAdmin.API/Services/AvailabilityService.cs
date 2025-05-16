using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class AvailabilityService(AppDbContext db)
{
    public async Task<AvailabilityResponse> SetAsync(int userId, SetAvailabilityRequest request)
    {
        var existing = await db.StaffAvailabilities
            .FirstOrDefaultAsync(a => a.UserId == userId && a.Date == request.Date);

        if (existing != null)
        {
            existing.IsAvailable = request.IsAvailable;
        }
        else
        {
            existing = new StaffAvailability
            {
                UserId = userId,
                Date = request.Date,
                IsAvailable = request.IsAvailable
            };
            db.StaffAvailabilities.Add(existing);
        }

        await db.SaveChangesAsync();
        return ToResponse(existing);
    }

    public async Task<List<AvailabilityResponse>> GetMyAvailabilityAsync(int userId) =>
        await db.StaffAvailabilities
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.Date)
            .Select(a => ToResponse(a))
            .ToListAsync();

    public async Task<List<AvailabilityResponse>> GetAllAsync() =>
        await db.StaffAvailabilities
            .Include(a => a.User)
            .OrderBy(a => a.Date)
            .Select(a => ToResponse(a))
            .ToListAsync();

    private static AvailabilityResponse ToResponse(StaffAvailability a) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        UserFullName = a.User?.FullName ?? string.Empty,
        Date = a.Date,
        IsAvailable = a.IsAvailable
    };
}
