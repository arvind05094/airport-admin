using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class ShiftCoverService(AppDbContext db)
{
    public async Task<(ShiftCoverResponse? result, string? error)> ApplyAsync(int requesterId, ApplyShiftCoverRequest request)
    {
        if (request.ShiftDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            return (null, "Shift date must be in the future.");

        if (request.ShiftEndTime <= request.ShiftStartTime)
            return (null, "Shift end time must be after start time.");

        var shift = new ShiftCoverRequest
        {
            RequesterId = requesterId,
            ShiftDate = request.ShiftDate,
            ShiftStartTime = request.ShiftStartTime,
            ShiftEndTime = request.ShiftEndTime,
            Reason = request.Reason
        };

        db.ShiftCoverRequests.Add(shift);
        await db.SaveChangesAsync();
        await db.Entry(shift).Reference(s => s.Requester).LoadAsync();
        return (ToResponse(shift), null);
    }

    public async Task<List<ShiftCoverResponse>> GetMyRequestsAsync(int requesterId) =>
        await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .Where(s => s.RequesterId == requesterId)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToResponse(s))
            .ToListAsync();

    public async Task<List<ShiftCoverResponse>> GetAllAsync() =>
        await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .OrderByDescending(s => s.CreatedAt)
            .Select(s => ToResponse(s))
            .ToListAsync();

    public async Task<(ShiftCoverResponse? result, string? error)> UpdateStatusAsync(int id, string status)
    {
        var shift = await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null) return (null, "Shift cover request not found.");
        if (shift.Status != "Pending") return (null, "Only pending requests can be updated.");

        shift.Status = status;
        await db.SaveChangesAsync();
        return (ToResponse(shift), null);
    }

    public async Task<(bool success, string? error)> CancelAsync(int id, int requesterId)
    {
        var shift = await db.ShiftCoverRequests.FindAsync(id);
        if (shift == null) return (false, "Shift cover request not found.");
        if (shift.RequesterId != requesterId) return (false, "Not authorized.");
        if (shift.Status != "Pending") return (false, "Only pending requests can be cancelled.");

        db.ShiftCoverRequests.Remove(shift);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static ShiftCoverResponse ToResponse(ShiftCoverRequest s) => new()
    {
        Id = s.Id,
        RequesterId = s.RequesterId,
        RequesterFullName = s.Requester?.FullName ?? string.Empty,
        CoveredById = s.CoveredById,
        CoveredByFullName = s.CoveredBy?.FullName,
        ShiftDate = s.ShiftDate,
        ShiftStartTime = s.ShiftStartTime,
        ShiftEndTime = s.ShiftEndTime,
        Reason = s.Reason,
        Status = s.Status,
        CreatedAt = s.CreatedAt
    };
}
