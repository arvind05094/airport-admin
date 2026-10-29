using AirportAdmin.API.Data;
using AirportAdmin.API.DTOs;
using AirportAdmin.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace AirportAdmin.API.Services;

public class UserService(AppDbContext db)
{
    public async Task<List<UserResponse>> GetAllAsync() =>
        await db.Users
            .Include(u => u.JobRole)
            .Include(u => u.ConstraintProfile)
            .Select(u => ToResponse(u)).ToListAsync();

    public async Task<UserResponse?> GetByIdAsync(int id) =>
        await db.Users
            .Include(u => u.JobRole)
            .Include(u => u.ConstraintProfile)
            .Where(u => u.Id == id)
            .Select(u => ToResponse(u))
            .FirstOrDefaultAsync();

    public async Task<UserResponse?> CreateAsync(CreateUserRequest request)
    {
        // Case-insensitive check to prevent duplicate email registration
        var emailNormalized = request.Email.Trim().ToLower();
        if (await db.Users.AnyAsync(u => u.Email.ToLower() == emailNormalized))
            return null;

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            JobRoleId = request.JobRoleId,
            ConstraintProfileId = request.ConstraintProfileId
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        await db.Entry(user).Reference(u => u.JobRole).LoadAsync();
        await db.Entry(user).Reference(u => u.ConstraintProfile).LoadAsync();
        return ToResponse(user);
    }

    public async Task<UserResponse?> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await db.Users
            .Include(u => u.JobRole)
            .Include(u => u.ConstraintProfile)
            .FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        if (request.Email != null)
        {
            var newEmailNormalized = request.Email.Trim().ToLower();
            if (user.Email.ToLower() != newEmailNormalized &&
                await db.Users.AnyAsync(u => u.Email.ToLower() == newEmailNormalized))
            {
                return null;
            }
            user.Email = request.Email.Trim();
        }

        if (request.FullName != null) user.FullName = request.FullName;
        if (request.Role != null) user.Role = request.Role;
        if (request.JobRoleId.HasValue) user.JobRoleId = request.JobRoleId;
        if (request.ConstraintProfileId.HasValue) user.ConstraintProfileId = request.ConstraintProfileId;

        await db.SaveChangesAsync();
        await db.Entry(user).Reference(u => u.JobRole).LoadAsync();
        await db.Entry(user).Reference(u => u.ConstraintProfile).LoadAsync();
        return ToResponse(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user == null) return false;

        // Prevent deletion of admin@airportadmin.com
        if (string.Equals(user.Email, "admin@airportadmin.com", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("The main administrator account (admin@airportadmin.com) cannot be deleted.");
        }

        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return true;
    }

    private static UserResponse ToResponse(User u) => new()
    {
        Id = u.Id,
        FullName = u.FullName,
        Email = u.Email,
        Role = u.Role,
        JobRoleId = u.JobRoleId,
        JobRoleName = u.JobRole?.Name,
        ConstraintProfileId = u.ConstraintProfileId,
        ConstraintProfileName = u.ConstraintProfile?.Name,
        CreatedAt = u.CreatedAt
    };
}