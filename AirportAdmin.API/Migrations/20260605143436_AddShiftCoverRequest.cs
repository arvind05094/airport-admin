using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AirportAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddShiftCoverRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ShiftCoverRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RequesterId = table.Column<int>(type: "integer", nullable: false),
                    CoveredById = table.Column<int>(type: "integer", nullable: true),
                    ShiftDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ShiftStartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    ShiftEndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShiftCoverRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShiftCoverRequests_Users_CoveredById",
                        column: x => x.CoveredById,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ShiftCoverRequests_Users_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShiftCoverRequests_CoveredById",
                table: "ShiftCoverRequests",
                column: "CoveredById");

            migrationBuilder.CreateIndex(
                name: "IX_ShiftCoverRequests_RequesterId",
                table: "ShiftCoverRequests",
                column: "RequesterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShiftCoverRequests");
        }
    }
}
