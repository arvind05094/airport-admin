using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class LocationService(AppDbContext db)
{
    public async Task<List<LocationResponse>> GetAllAsync() =>
        await db.Locations.Select(l => ToResponse(l)).ToListAsync();

    public async Task<(LocationResponse? result, string? error)> CreateAsync(CreateLocationRequest request)
    {
        if (await db.Locations.AnyAsync(l => l.Name == request.Name))
            return (null, "Location already exists.");

        var location = new Location { Name = request.Name };
        db.Locations.Add(location);
        await db.SaveChangesAsync();
        return (ToResponse(location), null);
    }

    public async Task<(bool success, string? error)> DeleteAsync(int id)
    {
        var location = await db.Locations.FindAsync(id);
        if (location == null) return (false, "Location not found.");

        db.Locations.Remove(location);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static LocationResponse ToResponse(Location l) => new()
    {
        Id = l.Id,
        Name = l.Name
    };
}
