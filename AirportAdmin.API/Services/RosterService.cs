using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using AirportAdmin.API.Helpers;
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
            var eligibleUsers = allUsers
                .Where(u => u.JobRoleId == sr.JobRoleId)
                .OrderBy(u => existingAssignments
                    .Concat(newAssignments)
                    .Where(a => a.UserId == u.Id &&
                                a.Date >= sr.Date.AddDays(-(int)sr.Date.DayOfWeek) &&
                                a.Date <= sr.Date.AddDays(6 - (int)sr.Date.DayOfWeek))
                    .Sum(a => (a.EndTime - a.StartTime).TotalHours))
                .ToList();
            var assigned = 0;

            foreach (var user in eligibleUsers)
            {
                if (assigned >= sr.RequiredCount) break;
                if (RosterHelper.IsOnLeave(user.Id, sr.Date, approvedLeaves)) continue;
                if (RosterHelper.IsUnavailable(user.Id, sr.Date, unavailableDates)) continue;
                if (!RosterHelper.PassesConstraints(user, sr.Date, shiftHours, existingAssignments, newAssignments)) continue;

                newAssignments.Add(new ShiftAssignment
                {
                    UserId = user.Id,
                    StaffingRequestId = sr.Id,
                    Date = sr.Date,
                    StartTime = sr.StartTime,
                    EndTime = sr.EndTime,
                    LocationId = sr.LocationId,
                    JobRoleId = sr.JobRoleId
                });
                assigned++;
            }

            if (assigned < sr.RequiredCount)
                unfilledCount++;

            if (assigned == 0)
                sr.Status = "Pending";
            else if (assigned < sr.RequiredCount)
                sr.Status = "Partially Filled";
            else
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

        return (new RosterGenerationResult
        {
            TotalAssignments = newAssignments.Count,
            UnfilledRequests = unfilledCount,
            Assignments = newAssignments.Select(ToResponse).ToList()
        }, null);
    }

    public async Task<List<ShiftAssignmentResponse>> GetAllAsync()
    {
        var assignments = await db.ShiftAssignments
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return assignments.Select(ToResponse).ToList();
    }

    public async Task<List<ShiftAssignmentResponse>> GetMyAssignmentsAsync(int userId)
    {
        var assignments = await db.ShiftAssignments
            .Include(a => a.User)
            .Include(a => a.Location)
            .Include(a => a.JobRole)
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.Date)
            .ToListAsync();

        return assignments.Select(ToResponse).ToList();
    }

    public async Task<(bool success, string? error)> DeleteAsync(int id)
    {
        var assignment = await db.ShiftAssignments
            .Include(a => a.StaffingRequest)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment == null) return (false, "Assignment not found.");

        if (assignment.StaffingRequest != null)
            assignment.StaffingRequest.Status = "Pending";

        db.ShiftAssignments.Remove(assignment);
        await db.SaveChangesAsync();
        return (true, null);
    }

    public async Task<(GenerateForRequestResult? result, string? error)> GenerateForRequestAsync(int staffingRequestId)
    {
        var sr = await db.StaffingRequests
            .Include(s => s.Location)
            .Include(s => s.JobRole)
            .FirstOrDefaultAsync(s => s.Id == staffingRequestId);

        if (sr == null) return (null, "Staffing request not found.");
        if (sr.Status == "Fulfilled") return (null, "This request is already fulfilled.");

        var alreadyAssigned = await db.ShiftAssignments
            .Where(a => a.StaffingRequestId == staffingRequestId)
            .Select(a => a.UserId)
            .ToListAsync();

        var allUsers = await db.Users
            .Include(u => u.ConstraintProfile)
            .Where(u => u.JobRoleId == sr.JobRoleId && !alreadyAssigned.Contains(u.Id))
            .ToListAsync();

        var approvedLeaves = await db.LeaveRequests
            .Where(l => l.Status == "Approved")
            .ToListAsync();

        var unavailableDates = await db.StaffAvailabilities
            .Where(a => !a.IsAvailable)
            .ToListAsync();

        var existingAssignments = await db.ShiftAssignments
            .Where(a => a.Date == sr.Date)
            .ToListAsync();

        var newAssignments = new List<ShiftAssignment>();
        var shiftHours = (sr.EndTime - sr.StartTime).TotalHours;
        var assigned = 0;

        var eligibleUsers = allUsers
            .OrderBy(u => existingAssignments
                .Where(a => a.UserId == u.Id &&
                            a.Date >= sr.Date.AddDays(-(int)sr.Date.DayOfWeek) &&
                            a.Date <= sr.Date.AddDays(6 - (int)sr.Date.DayOfWeek))
                .Sum(a => (a.EndTime - a.StartTime).TotalHours))
            .ToList();

        foreach (var user in eligibleUsers)
        {
            if (assigned >= sr.RequiredCount) break;
            if (RosterHelper.IsOnLeave(user.Id, sr.Date, approvedLeaves)) continue;
            if (RosterHelper.IsUnavailable(user.Id, sr.Date, unavailableDates)) continue;
            if (!RosterHelper.PassesConstraints(user, sr.Date, shiftHours, existingAssignments, newAssignments)) continue;

            newAssignments.Add(new ShiftAssignment
            {
                UserId = user.Id,
                StaffingRequestId = sr.Id,
                Date = sr.Date,
                StartTime = sr.StartTime,
                EndTime = sr.EndTime,
                LocationId = sr.LocationId,
                JobRoleId = sr.JobRoleId
            });
            assigned++;
        }

        var totalAssigned = alreadyAssigned.Count + assigned;

        if (totalAssigned == 0)
            sr.Status = "Pending";
        else if (totalAssigned < sr.RequiredCount)
            sr.Status = "Partially Filled";
        else
            sr.Status = "Fulfilled";

        db.ShiftAssignments.AddRange(newAssignments);
        await db.SaveChangesAsync();

        foreach (var a in newAssignments)
        {
            await db.Entry(a).Reference(x => x.User).LoadAsync();
            await db.Entry(a).Reference(x => x.Location).LoadAsync();
            await db.Entry(a).Reference(x => x.JobRole).LoadAsync();
        }

        return (new GenerateForRequestResult
        {
            StaffingRequestId = sr.Id,
            RequiredCount = sr.RequiredCount,
            AssignedCount = totalAssigned,
            UnfilledCount = sr.RequiredCount - totalAssigned,
            Status = sr.Status,
            Assignments = newAssignments.Select(ToResponse).ToList()
        }, null);
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