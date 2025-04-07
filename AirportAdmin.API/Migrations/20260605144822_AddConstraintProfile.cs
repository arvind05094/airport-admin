using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AirportAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddConstraintProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConstraintProfileId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ConstraintProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    MaxHoursPerDay = table.Column<int>(type: "integer", nullable: false),
                    MaxHoursPerWeek = table.Column<int>(type: "integer", nullable: false),
                    MaxConsecutiveDays = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConstraintProfiles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_ConstraintProfileId",
                table: "Users",
                column: "ConstraintProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ConstraintProfiles_ConstraintProfileId",
                table: "Users",
                column: "ConstraintProfileId",
                principalTable: "ConstraintProfiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_ConstraintProfiles_ConstraintProfileId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "ConstraintProfiles");

            migrationBuilder.DropIndex(
                name: "IX_Users_ConstraintProfileId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ConstraintProfileId",
                table: "Users");
        }
    }
}
