using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class RosterService(AppDbContext db)
{
    public async Task<(RosterGenerationResult? result, string? error)> GenerateAsync(GenerateRosterRequest request)
    {
        if (request.EndDate < request.StartDate)
            return (null, "End date must be after start date.");

        var staffingRequests = await db.StaffingRequests
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .Where(s =>
                s.Status == "Pending" &&
                s.Date >= request.StartDate &&
                s.Date <= request.EndDate &&
                (request.LocationId == null || s.LocationId == request.LocationId) &&
                (request.JobRoleId == null || s.JobRoleId == request.JobRoleId))
            .ToListAsync();

        if (staffingRequests.Count == 0)
            return (null, "No pending staffing requests found for the given criteria.");

        var allUsers = await db.Users
            .Include(u => u.ConstraintProfile)
            .Where(u => u.JobRoleId != null)
            .ToListAsync();

        var approvedLeaves = await db.LeaveRequests
            .Where(l => l.Status == "Approved")
            .ToListAsync();

        var unavailableDates = await db.StaffAvailabilities
            .Where(a => !a.IsAvailable)
            .ToListAsync();

        var existingAssignments = await db.ShiftAssignments
            .Where(a => a.Date >= request.StartDate && a.Date <= request.EndDate)
            .ToListAsync();

        var newAssignments = new List<ShiftAssignment>();
        var unfilledCount = 0;

        foreach (var sr in staffingRequests)
        {
            var shiftHours = (sr.EndTime - sr.StartTime).TotalHours;
            var eligibleUsers = allUsers.Where(u => u.JobRoleId == sr.JobRoleId).ToList();
            var assigned = 0;

            foreach (var user in eligibleUsers)
            {
                if (assigned >= sr.RequiredCount) break;

                if (IsOnLeave(user.Id, sr.Date, approvedLeaves)) continue;
                if (IsUnavailable(user.Id, sr.Date, unavailableDates)) continue;
                if (!PassesConstraints(user, sr.Date, shiftHours, existingAssignments, newAssignments)) continue;

                var assignment = new ShiftAssignment
                {
                    UserId = user.Id,
                    StaffingRequestId = sr.Id,
                    Date = sr.Date,
                    StartTime = sr.StartTime,
                    EndTime = sr.EndTime,
                    LocationId = sr.LocationId,
                    JobRoleId = sr.JobRoleId
                };

                newAssignments.Add(assignment);
                assigned++;
            }

            if (assigned < sr.RequiredCount)
                unfilledCount++;

            if (assigned > 0)
                sr.Status = "Fulfilled";
        }

        db.ShiftAssignments.AddRange(newAssignments);
        await db.SaveChangesAsync();

        await db.ShiftAssignments
            .Where(a => newAssignments.Select(n => n.Id).Contains(a.Id))
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .LoadAsync();

        var responses = newAssignments.Select(a => ToResponse(a)).ToList();

        return (new RosterGenerationResult
        {
            TotalAssignments = newAssignments.Count,
            UnfilledRequests = unfilledCount,
            Assignments = responses
        }, null);
    }

    public async Task<List<ShiftAssignmentResponse>> GetAllAsync() =>
        await db.ShiftAssignments
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .OrderBy(a => a.Date)
            .Select(a => ToResponse(a))
            .ToListAsync();

    public async Task<List<ShiftAssignmentResponse>> GetMyAssignmentsAsync(int userId) =>
        await db.ShiftAssignments
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.Date)
            .Select(a => ToResponse(a))
            .ToListAsync();

    public async Task<(bool success, string? error)> DeleteAsync(int id)
    {
        var assignment = await db.ShiftAssignments.FindAsync(id);
        if (assignment == null) return (false, "Assignment not found.");

        db.ShiftAssignments.Remove(assignment);
        await db.SaveChangesAsync();
        return (true, null);
    }

    private static bool IsOnLeave(int userId, DateOnly date, List<LeaveRequest> leaves) =>
        leaves.Any(l => l.UserId == userId && l.StartDate <= date && l.EndDate >= date);

    private static bool IsUnavailable(int userId, DateOnly date, List<StaffAvailability> unavailable) =>
        unavailable.Any(a => a.UserId == userId && a.Date == date);

    private static bool PassesConstraints(
        User user,
        DateOnly date,
        double shiftHours,
        List<ShiftAssignment> existing,
        List<ShiftAssignment> pending)
    {
        var profile = user.ConstraintProfile;
        if (profile == null) return true;

        var allAssignments = existing.Concat(pending).Where(a => a.UserId == user.Id).ToList();

        // Check max hours per day
        var hoursOnDay = allAssignments
            .Where(a => a.Date == date)
            .Sum(a => (a.EndTime - a.StartTime).TotalHours);

        if (hoursOnDay + shiftHours > profile.MaxHoursPerDay) return false;

        // Check max hours per week
        var weekStart = date.AddDays(-(int)date.DayOfWeek);
        var weekEnd = weekStart.AddDays(6);
        var hoursThisWeek = allAssignments
            .Where(a => a.Date >= weekStart && a.Date <= weekEnd)
            .Sum(a => (a.EndTime - a.StartTime).TotalHours);

        if (hoursThisWeek + shiftHours > profile.MaxHoursPerWeek) return false;

        // Check max consecutive days
        var consecutiveDays = 0;
        var checkDate = date.AddDays(-1);
        while (allAssignments.Any(a => a.Date == checkDate))
        {
            consecutiveDays++;
            checkDate = checkDate.AddDays(-1);
        }

        if (consecutiveDays >= profile.MaxConsecutiveDays) return false;

        return true;
    }

    private static ShiftAssignmentResponse ToResponse(ShiftAssignment a) => new()
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
    };
}
