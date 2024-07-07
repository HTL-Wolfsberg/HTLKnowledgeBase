using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class FileModelVariableChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FileType",
                table: "Files",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "FileSize",
                table: "Files",
                newName: "Size");

            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "Files",
                newName: "Path");

            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "Files",
                newName: "Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Files",
                newName: "FileType");

            migrationBuilder.RenameColumn(
                name: "Size",
                table: "Files",
                newName: "FileSize");

            migrationBuilder.RenameColumn(
                name: "Path",
                table: "Files",
                newName: "FilePath");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Files",
                newName: "FileName");
        }
    }
}
