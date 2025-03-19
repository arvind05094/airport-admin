using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class LeaveService(AppDbContext db)
{
    public async Task<(LeaveResponse? result, string? error)> ApplyAsync(int userId, ApplyLeaveRequest request)
    {
        if (request.StartDate < DateOnly.FromDateTime(DateTime.UtcNow))
            return (null, "Start date cannot be in the past.");

        if (request.EndDate < request.StartDate)
            return (null, "End date cannot be before start date.");

        var hasOverlap = await db.LeaveRequests.AnyAsync(l =>
            l.UserId == userId &&
            l.Status != "Rejected" &&
            l.StartDate <= request.EndDate &&
            l.EndDate >= request.StartDate);

        if (hasOverlap)
            return (null, "You already have a leave request overlapping these dates.");

        var leave = new LeaveRequest
        {
            UserId = userId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason
        };

        db.LeaveRequests.Add(leave);
        await db.SaveChangesAsync();
        await db.Entry(leave).Reference(l => l.User).LoadAsync();
        return (ToResponse(leave), null);
    }

    public async Task<List<LeaveResponse>> GetMyLeavesAsync(int userId) =>
        await db.LeaveRequests
            .Include(l => l.User)
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => ToResponse(l))
            .ToListAsync();

    public async Task<List<LeaveResponse>> GetAllAsync() =>
        await db.LeaveRequests
            .Include(l => l.User)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => ToResponse(l))
            .ToListAsync();

    public async Task<(LeaveResponse? result, string? error)> UpdateStatusAsync(int id, string status)
    {
        var leave = await db.LeaveRequests.Include(l => l.User).FirstOrDefaultAsync(l => l.Id == id);
        if (leave == null) return (null, "Leave request not found.");
        if (leave.Status != "Pending") return (null, "Only pending requests can be updated.");

        leave.Status = status;
        await db.SaveChangesAsync();
        return (ToResponse(leave), null);
    }

    public async Task<(bool success, string? error)> CancelAsync(int id, int userId)
    {
        var leave = await db.LeaveRequests.FindAsync(id);
        if (leave == null) return (false, "Leave request not found.");
        if (leave.UserId != userId) return (false, "Not authorized.");
        if (leave.Status != "Pending") return (false, "Only pending requests can be cancelled.");

        db.LeaveRequests.Remove(leave);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static LeaveResponse ToResponse(LeaveRequest l) => new()
    {
        Id = l.Id,
        UserId = l.UserId,
        UserFullName = l.User?.FullName ?? string.Empty,
        StartDate = l.StartDate,
        EndDate = l.EndDate,
        Reason = l.Reason,
        Status = l.Status,
        CreatedAt = l.CreatedAt
    };
}
