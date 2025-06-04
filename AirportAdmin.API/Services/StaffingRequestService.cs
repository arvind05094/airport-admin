using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class StaffingRequestService(AppDbContext db)
{
    public async Task<(List<StaffingRequestResponse> results, string? error)> CreateAsync(int userId, CreateStaffingRequest request)
    {
        if (request.StartDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            return ([], "Start date must be in the future.");

        if (request.EndDate < request.StartDate)
            return ([], "End date must be after start date.");

        if (request.EndDate > request.StartDate.AddDays(28))
            return ([], "Date range cannot exceed 28 days.");

        if (request.EndTime <= request.StartTime)
            return ([], "End time must be after start time.");

        var locationExists = await db.Locations.AnyAsync(l => l.Id == request.LocationId);
        if (!locationExists) return ([], "Location not found.");

        var roleExists = await db.JobRoles.AnyAsync(r => r.Id == request.JobRoleId);
        if (!roleExists) return ([], "Job role not found.");

        var staffingRequests = new List<StaffingRequest>();
        var current = request.StartDate;

        while (current <= request.EndDate)
        {
            staffingRequests.Add(new StaffingRequest
            {
                CreatedById = userId,
                LocationId = request.LocationId,
                JobRoleId = request.JobRoleId,
                Date = current,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                RequiredCount = request.RequiredCount
            });
            current = current.AddDays(1);
        }

        db.StaffingRequests.AddRange(staffingRequests);
        await db.SaveChangesAsync();

        foreach (var sr in staffingRequests)
        {
            await db.Entry(sr).Reference(s => s.CreatedBy).LoadAsync();
            await db.Entry(sr).Reference(s => s.Location).LoadAsync();
            await db.Entry(sr).Reference(s => s.JobRole).LoadAsync();
        }

        return (staffingRequests.Select(ToResponse).ToList(), null);
    }

    public async Task<(List<StaffingRequestResponse> results, string? error)> CreateBulkAsync(int userId, BulkCreateStaffingRequest bulk)
    {
        var allRequests = new List<StaffingRequest>();

        foreach (var (request, index) in bulk.Requests.Select((r, i) => (r, i)))
        {
            var rowLabel = $"Row {index + 1}";

            if (request.StartDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
                return ([], $"{rowLabel}: Start date must be in the future.");

            if (request.EndDate < request.StartDate)
                return ([], $"{rowLabel}: End date must be after start date.");

            if (request.EndDate > request.StartDate.AddDays(28))
                return ([], $"{rowLabel}: Date range cannot exceed 28 days.");

            if (request.EndTime <= request.StartTime)
                return ([], $"{rowLabel}: End time must be after start time.");

            var locationExists = await db.Locations.AnyAsync(l => l.Id == request.LocationId);
            if (!locationExists) return ([], $"{rowLabel}: Location not found.");

            var roleExists = await db.JobRoles.AnyAsync(r => r.Id == request.JobRoleId);
            if (!roleExists) return ([], $"{rowLabel}: Job role not found.");

            var current = request.StartDate;
            while (current <= request.EndDate)
            {
                allRequests.Add(new StaffingRequest
                {
                    CreatedById = userId,
                    LocationId = request.LocationId,
                    JobRoleId = request.JobRoleId,
                    Date = current,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime,
                    RequiredCount = request.RequiredCount
                });
                current = current.AddDays(1);
            }
        }

        db.StaffingRequests.AddRange(allRequests);
        await db.SaveChangesAsync();

        foreach (var sr in allRequests)
        {
            await db.Entry(sr).Reference(s => s.CreatedBy).LoadAsync();
            await db.Entry(sr).Reference(s => s.Location).LoadAsync();
            await db.Entry(sr).Reference(s => s.JobRole).LoadAsync();
        }

        return (allRequests.Select(ToResponse).ToList(), null);
    }

    public async Task<List<StaffingRequestResponse>> GetMyRequestsAsync(int userId) =>
        await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .Where(s => s.CreatedById == userId)
            .OrderByDescending(s => s.Date)
            .Select(s => ToResponse(s))
            .ToListAsync();

    public async Task<List<StaffingRequestResponse>> GetAllAsync() =>
        await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .OrderByDescending(s => s.Date)
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

    public async Task<(StaffingRequestDetailResponse? result, string? error)> GetDetailAsync(int id, int userId, string role)
    {
        var sr = await db.StaffingRequests
            .Include(s => s.CreatedBy)
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sr == null) return (null, "Staffing request not found.");
        if (role != "Admin" && sr.CreatedById != userId)
            return (null, "Not authorized.");

        var assignments = await db.ShiftAssignments
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .Where(a => a.StaffingRequestId == id)
            .ToListAsync();

        var assignedCount = assignments.Count;

        return (new StaffingRequestDetailResponse
        {
            Id = sr.Id,
            CreatedById = sr.CreatedById,
            CreatedByFullName = sr.CreatedBy?.FullName ?? string.Empty,
            LocationId = sr.LocationId,
            LocationName = sr.Location?.Name ?? string.Empty,
            JobRoleId = sr.JobRoleId,
            JobRoleName = sr.JobRole?.Name ?? string.Empty,
            Date = sr.Date,
            StartTime = sr.StartTime,
            EndTime = sr.EndTime,
            RequiredCount = sr.RequiredCount,
            AssignedCount = assignedCount,
            UnfilledCount = sr.RequiredCount - assignedCount,
            Status = sr.Status,
            CreatedAt = sr.CreatedAt,
            Assignments = assignments.Select(a => new ShiftAssignmentResponse
            {
                Id = a.Id,
                UserId = a.UserId,
                UserFullName = a.User?.FullName ?? string.Empty,
                StaffingRequestId = a.StaffingRequestId,
                Date = a.Date,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                LocationName = a.Location?.Name ?? string.Empty,
                JobRoleName = a.JobRole?.Name ?? string.Empty
            }).ToList()
        }, null);
    }
}
