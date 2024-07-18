using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations.File
{
    /// <inheritdoc />
    public partial class RemovedRedundantFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Files",
                newName: "AuthorName");

            migrationBuilder.RenameColumn(
                name: "Author",
                table: "Files",
                newName: "AuthorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AuthorName",
                table: "Files",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "AuthorId",
                table: "Files",
                newName: "Author");
        }
    }
}
