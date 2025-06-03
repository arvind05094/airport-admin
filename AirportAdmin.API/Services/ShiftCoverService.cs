using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using AirportAdmin.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class ShiftCoverService(AppDbContext db)
{
    public async Task<(ShiftCoverResponse? result, string? error)> ApplyAsync(int requesterId, ApplyShiftCoverRequest request)
    {
        var assignment = await db.ShiftAssignments
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .FirstOrDefaultAsync(a => a.Id == request.ShiftAssignmentId);

        if (assignment == null) return (null, "Shift assignment not found.");
        if (assignment.UserId != requesterId) return (null, "You can only request cover for your own shifts.");
        if (assignment.Date < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            return (null, "Shift date must be in the future.");

        var alreadyRequested = await db.ShiftCoverRequests
            .AnyAsync(s => s.ShiftAssignmentId == request.ShiftAssignmentId && s.Status == "Pending");
        if (alreadyRequested) return (null, "A cover request already exists for this shift.");

        var shift = new ShiftCoverRequest
        {
            RequesterId = requesterId,
            ShiftAssignmentId = request.ShiftAssignmentId,
            ShiftDate = assignment.Date,
            ShiftStartTime = assignment.StartTime,
            ShiftEndTime = assignment.EndTime,
            Reason = request.Reason
        };

        db.ShiftCoverRequests.Add(shift);
        await db.SaveChangesAsync();
        await db.Entry(shift).Reference(s => s.Requester).LoadAsync();
        return (ToResponse(shift), null);
    }

    public async Task<List<ShiftCoverResponse>> GetMyRequestsAsync(int requesterId)
    {
        var requests = await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .Where(s => s.RequesterId == requesterId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return requests.Select(ToResponse).ToList();
    }

    public async Task<List<ShiftCoverResponse>> GetAllAsync()
    {
        var requests = await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return requests.Select(ToResponse).ToList();
    }

    public async Task<(ShiftCoverResponse? result, string? error)> ApproveAsync(int id, int coveredById)
    {
        var shift = await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .Include(s => s.ShiftAssignment)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null) return (null, "Shift cover request not found.");
        if (shift.Status != "Pending") return (null, "Only pending requests can be approved.");

        var coveringUser = await db.Users
            .Include(u => u.ConstraintProfile)
            .FirstOrDefaultAsync(u => u.Id == coveredById);
        if (coveringUser == null) return (null, "Covering user not found.");

        var approvedLeaves = await db.LeaveRequests
            .Where(l => l.Status == "Approved")
            .ToListAsync();

        var unavailableDates = await db.StaffAvailabilities
            .Where(a => !a.IsAvailable)
            .ToListAsync();

        var existingAssignments = await db.ShiftAssignments
            .Where(a => a.UserId == coveredById)
            .ToListAsync();

        if (RosterHelper.IsOnLeave(coveredById, shift.ShiftDate, approvedLeaves))
            return (null, "Covering user is on approved leave on this date.");

        if (RosterHelper.IsUnavailable(coveredById, shift.ShiftDate, unavailableDates))
            return (null, "Covering user is marked unavailable on this date.");

        var shiftHours = (shift.ShiftEndTime - shift.ShiftStartTime).TotalHours;

        if (!RosterHelper.PassesConstraints(coveringUser, shift.ShiftDate, shiftHours, existingAssignments, []))
            return (null, "Covering user would exceed their constraint profile limits.");

        shift.Status = "Approved";
        shift.CoveredById = coveredById;
        shift.ShiftAssignment.UserId = coveredById;

        await db.SaveChangesAsync();
        await db.Entry(shift).Reference(s => s.CoveredBy).LoadAsync();
        return (ToResponse(shift), null);
    }

    public async Task<(ShiftCoverResponse? result, string? error)> RejectAsync(int id)
    {
        var shift = await db.ShiftCoverRequests
            .Include(s => s.Requester)
            .Include(s => s.CoveredBy)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (shift == null) return (null, "Shift cover request not found.");
        if (shift.Status != "Pending") return (null, "Only pending requests can be rejected.");

        shift.Status = "Rejected";
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
        ShiftAssignmentId = s.ShiftAssignmentId,
        ShiftDate = s.ShiftDate,
        ShiftStartTime = s.ShiftStartTime,
        ShiftEndTime = s.ShiftEndTime,
        Reason = s.Reason,
        Status = s.Status,
        CreatedAt = s.CreatedAt
    };
}