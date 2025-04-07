using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AirportAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddShiftAssignmentAndUserJobRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "JobRoleId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ShiftAssignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    StaffingRequestId = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    JobRoleId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftAssignments_JobRoles_JobRoleId",
                        column: x => x.JobRoleId,
                        principalTable: "JobRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShiftAssignments_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShiftAssignments_StaffingRequests_StaffingRequestId",
                        column: x => x.StaffingRequestId,
                        principalTable: "StaffingRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShiftAssignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_JobRoleId",
                table: "Users",
                column: "JobRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_JobRoleId",
                table: "ShiftAssignments",
                column: "JobRoleId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_LocationId",
                table: "ShiftAssignments",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_StaffingRequestId",
                table: "ShiftAssignments",
                column: "StaffingRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftAssignments_UserId",
                table: "ShiftAssignments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_JobRoles_JobRoleId",
                table: "Users",
                column: "JobRoleId",
                principalTable: "JobRoles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_JobRoles_JobRoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ShiftAssignments");

            migrationBuilder.DropIndex(
                name: "IX_Users_JobRoleId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "JobRoleId",
                table: "Users");
        }
    }
}
