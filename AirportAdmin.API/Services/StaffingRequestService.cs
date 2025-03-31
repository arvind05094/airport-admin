using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class StaffingRequestService(AppDbContext db)
{
    public async Task<(StaffingRequestResponse? result, string? error)> CreateAsync(int userId, CreateStaffingRequest request)
    {
        if (request.Date < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            return (null, "Date must be in the future.");

        if (request.EndTime <= request.StartTime)
            return (null, "End time must be after start time.");

        var locationExists = await db.Locations.AnyAsync(l => l.Id == request.LocationId);
        if (!locationExists) return (null, "Location not found.");

        var roleExists = await db.JobRoles.AnyAsync(r => r.Id == request.JobRoleId);
        if (!roleExists) return (null, "Job role not found.");

        var staffingRequest = new StaffingRequest
        {
            CreatedById = userId,
            LocationId = request.LocationId,
            JobRoleId = request.JobRoleId,
            Date = request.Date,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            RequiredCount = request.RequiredCount
        };

        db.StaffingRequests.Add(staffingRequest);
        await db.SaveChangesAsync();

        await db.Entry(staffingRequest).Reference(s => s.CreatedBy).LoadAsync();
        await db.Entry(staffingRequest).Reference(s => s.Location).LoadAsync();
        await db.Entry(staffingRequest).Reference(s => s.JobRole).LoadAsync();

        return (ToResponse(staffingRequest), null);
    }

    public async Task<List<StaffingRequestResponse>> GetMyRequestsAsync(int userId) =>
        await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .Where(s => s.CreatedById == userId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToResponse(s))
            .ToListAsync();

    public async Task<List<StaffingRequestResponse>> GetAllAsync() =>
        await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToResponse(s))
            .ToListAsync();

    public async Task<(bool success, string? error)> CancelAsync(int id, int userId)
    {
        var request = await db.StaffingRequests.FindAsync(id);
        if (request == null) return (false, "Staffing request not found.");
        if (request.CreatedById != userId) return (false, "Not authorized.");
        if (request.Status != "Pending") return (false, "Only pending requests can be cancelled.");

        db.StaffingRequests.Remove(request);
        await db.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(StaffingRequestResponse? result, string? error)> FulfilAsync(int id)
    {
        var request = await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (request == null) return (null, "Staffing request not found.");
        if (request.Status != "Pending") return (null, "Only pending requests can be fulfilled.");

        request.Status = "Fulfilled";
        await db.SaveChangesAsync();
        return (ToResponse(request), null);
    }

    private static StaffingRequestResponse ToResponse(StaffingRequest s) => new()
    {
        Id = s.Id,
        CreatedById = s.CreatedById,
        CreatedByFullName = s.CreatedBy?.FullName ?? string.Empty,
        LocationId = s.LocationId,
        LocationName = s.Location?.Name ?? string.Empty,
        JobRoleId = s.JobRoleId,
        JobRoleName = s.JobRole?.Name ?? string.Empty,
        Date = s.Date,
        StartTime = s.StartTime,
        EndTime = s.EndTime,
        RequiredCount = s.RequiredCount,
        Status = s.Status,
        CreatedAt = s.CreatedAt
    };
}
