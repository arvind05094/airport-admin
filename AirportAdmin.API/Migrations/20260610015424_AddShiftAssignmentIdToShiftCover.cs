using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AirportAdmin.API.Migrations
{
    /// <inheritdoc />
    public partial class AddShiftAssignmentIdToShiftCover : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ShiftAssignmentId",
                table: "ShiftCoverRequests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ShiftCoverRequests_ShiftAssignmentId",
                table: "ShiftCoverRequests",
                column: "ShiftAssignmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShiftCoverRequests_ShiftAssignments_ShiftAssignmentId",
                table: "ShiftCoverRequests",
                column: "ShiftAssignmentId",
                principalTable: "ShiftAssignments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShiftCoverRequests_ShiftAssignments_ShiftAssignmentId",
                table: "ShiftCoverRequests");

            migrationBuilder.DropIndex(
                name: "IX_ShiftCoverRequests_ShiftAssignmentId",
                table: "ShiftCoverRequests");

            migrationBuilder.DropColumn(
                name: "ShiftAssignmentId",
                table: "ShiftCoverRequests");
        }
    }
}
