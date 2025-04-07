using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<ShiftCoverRequest> ShiftCoverRequests => Set<ShiftCoverRequest>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<JobRole> JobRoles => Set<JobRole>();
    public DbSet<StaffingRequest> StaffingRequests => Set<StaffingRequest>();
    public DbSet<ShiftAssignment> ShiftAssignments => Set<ShiftAssignment>();
    public DbSet<ConstraintProfile> ConstraintProfiles => Set<ConstraintProfile>();
}







