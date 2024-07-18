using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations.File
{
    /// <inheritdoc />
    public partial class AddedAuthor_Created_ModifiedToFileModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "Files",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Files",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "(now() at time zone 'utc')");

            migrationBuilder.AddColumn<DateTime>(
                name: "LastChanged",
                table: "Files",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "(now() at time zone 'utc')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Author",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "LastChanged",
                table: "Files");
        }
    }
}
