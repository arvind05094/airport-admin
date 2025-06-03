using AirportAdmin.API.Entities;

namespace AirportAdmin.API.Helpers;

public static class RosterHelper
{
    public static bool IsOnLeave(int userId, DateOnly date, List<LeaveRequest> leaves) =>
        leaves.Any(l => l.UserId == userId && l.StartDate <= date && l.EndDate >= date);

    public static bool IsUnavailable(int userId, DateOnly date, List<StaffAvailability> unavailable) =>
        unavailable.Any(a => a.UserId == userId && a.Date == date);

    public static bool PassesConstraints(
        User user,
        DateOnly date,
        double shiftHours,
        List<ShiftAssignment> existing,
        List<ShiftAssignment> pending)
    {
        var profile = user.ConstraintProfile;
        if (profile == null) return true;

        var allAssignments = existing.Concat(pending).Where(a => a.UserId == user.Id).ToList();

        var hoursOnDay = allAssignments
            .Where(a => a.Date == date)
            .Sum(a => (a.EndTime - a.StartTime).TotalHours);

        if (hoursOnDay + shiftHours > profile.MaxHoursPerDay) return false;

        var weekStart = date.AddDays(-(int)date.DayOfWeek);
        var weekEnd = weekStart.AddDays(6);
        var hoursThisWeek = allAssignments
            .Where(a => a.Date >= weekStart && a.Date <= weekEnd)
            .Sum(a => (a.EndTime - a.StartTime).TotalHours);

        if (hoursThisWeek + shiftHours > profile.MaxHoursPerWeek) return false;

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
}