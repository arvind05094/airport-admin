using AirportAdmin.API.Entities;
using AirportAdmin.API.Helpers;

namespace AirportAdmin.API.Tests;

public class RosterHelperTests
{
    private static User MakeUser(int id, ConstraintProfile? profile = null) => new()
    {
        Id = id,
        FullName = $"User {id}",
        Email = $"user{id}@test.com",
        ConstraintProfile = profile
    };

    private static ShiftAssignment MakeAssignment(int userId, DateOnly date, TimeOnly start, TimeOnly end) => new()
    {
        UserId = userId,
        Date = date,
        StartTime = start,
        EndTime = end
    };

    [Fact]
    public void IsOnLeave_ReturnsTrue_WhenDateWithinApprovedLeaveRange()
    {
        var leaves = new List<LeaveRequest>
        {
            new() { UserId = 1, StartDate = new DateOnly(2026, 6, 1), EndDate = new DateOnly(2026, 6, 5) }
        };

        Assert.True(RosterHelper.IsOnLeave(1, new DateOnly(2026, 6, 3), leaves));
        Assert.False(RosterHelper.IsOnLeave(1, new DateOnly(2026, 6, 6), leaves));
        Assert.False(RosterHelper.IsOnLeave(2, new DateOnly(2026, 6, 3), leaves));
    }

    [Fact]
    public void IsUnavailable_ReturnsTrue_OnlyForMatchingUserAndDate()
    {
        var unavailable = new List<StaffAvailability>
        {
            new() { UserId = 1, Date = new DateOnly(2026, 6, 3), IsAvailable = false }
        };

        Assert.True(RosterHelper.IsUnavailable(1, new DateOnly(2026, 6, 3), unavailable));
        Assert.False(RosterHelper.IsUnavailable(1, new DateOnly(2026, 6, 4), unavailable));
        Assert.False(RosterHelper.IsUnavailable(2, new DateOnly(2026, 6, 3), unavailable));
    }

    [Fact]
    public void PassesConstraints_ReturnsTrue_WhenUserHasNoConstraintProfile()
    {
        var user = MakeUser(1, profile: null);

        var result = RosterHelper.PassesConstraints(
            user, new DateOnly(2026, 6, 3), shiftHours: 12,
            existing: [], pending: []);

        Assert.True(result);
    }

    [Fact]
    public void PassesConstraints_ReturnsFalse_WhenShiftExceedsMaxHoursPerDay()
    {
        var profile = new ConstraintProfile { MaxHoursPerDay = 8, MaxHoursPerWeek = 40, MaxConsecutiveDays = 6 };
        var user = MakeUser(1, profile);
        var date = new DateOnly(2026, 6, 3);

        var existing = new List<ShiftAssignment>
        {
            MakeAssignment(1, date, new TimeOnly(6, 0), new TimeOnly(12, 0)) // 6 hours already
        };

        // Adding a 4-hour shift would total 10 hours, exceeding MaxHoursPerDay of 8
        var result = RosterHelper.PassesConstraints(user, date, shiftHours: 4, existing, pending: []);

        Assert.False(result);
    }

    [Fact]
    public void PassesConstraints_ReturnsFalse_WhenShiftExceedsMaxHoursPerWeek()
    {
        var profile = new ConstraintProfile { MaxHoursPerDay = 12, MaxHoursPerWeek = 20, MaxConsecutiveDays = 6 };
        var user = MakeUser(1, profile);

        // Sunday-anchored week: weekStart = date - DayOfWeek
        var monday = new DateOnly(2026, 6, 1); // a Monday
        var tuesday = monday.AddDays(1);

        var existing = new List<ShiftAssignment>
        {
            MakeAssignment(1, monday, new TimeOnly(0, 0), new TimeOnly(18, 0)) // 18 hours this week
        };

        // Adding a 4-hour shift on Tuesday would total 22 hours, exceeding MaxHoursPerWeek of 20
        var result = RosterHelper.PassesConstraints(user, tuesday, shiftHours: 4, existing, pending: []);

        Assert.False(result);
    }

    [Fact]
    public void PassesConstraints_ReturnsFalse_WhenConsecutiveDaysLimitReached()
    {
        var profile = new ConstraintProfile { MaxHoursPerDay = 12, MaxHoursPerWeek = 60, MaxConsecutiveDays = 2 };
        var user = MakeUser(1, profile);

        var day1 = new DateOnly(2026, 6, 1);
        var day2 = new DateOnly(2026, 6, 2);
        var day3 = new DateOnly(2026, 6, 3);

        var existing = new List<ShiftAssignment>
        {
            MakeAssignment(1, day1, new TimeOnly(8, 0), new TimeOnly(12, 0)),
            MakeAssignment(1, day2, new TimeOnly(8, 0), new TimeOnly(12, 0))
        };

        // User already worked day1 and day2 (2 consecutive days), MaxConsecutiveDays is 2
        var result = RosterHelper.PassesConstraints(user, day3, shiftHours: 4, existing, pending: []);

        Assert.False(result);
    }

    [Fact]
    public void PassesConstraints_ReturnsTrue_WhenWithinAllLimits()
    {
        var profile = new ConstraintProfile { MaxHoursPerDay = 12, MaxHoursPerWeek = 40, MaxConsecutiveDays = 6 };
        var user = MakeUser(1, profile);
        var date = new DateOnly(2026, 6, 3);

        var result = RosterHelper.PassesConstraints(user, date, shiftHours: 8, existing: [], pending: []);

        Assert.True(result);
    }

    [Fact]
    public void PassesConstraints_ConsidersPendingAssignments_AlongsideExisting()
    {
        var profile = new ConstraintProfile { MaxHoursPerDay = 8, MaxHoursPerWeek = 40, MaxConsecutiveDays = 6 };
        var user = MakeUser(1, profile);
        var date = new DateOnly(2026, 6, 3);

        var pending = new List<ShiftAssignment>
        {
            MakeAssignment(1, date, new TimeOnly(6, 0), new TimeOnly(12, 0)) // 6 hours pending today
        };

        // Adding another 4-hour shift would total 10 hours, exceeding MaxHoursPerDay of 8
        var result = RosterHelper.PassesConstraints(user, date, shiftHours: 4, existing: [], pending);

        Assert.False(result);
    }
}
