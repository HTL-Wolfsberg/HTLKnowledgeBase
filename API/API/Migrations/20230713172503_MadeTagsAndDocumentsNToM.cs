using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class MadeTagsAndDocumentsNToM : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Documents_DocumentGuid",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_DocumentGuid",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "DocumentGuid",
                table: "Tags");

            migrationBuilder.CreateTable(
                name: "DocumentTag",
                columns: table => new
                {
                    DocumentsGuid = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsGuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentTag", x => new { x.DocumentsGuid, x.TagsGuid });
                    table.ForeignKey(
                        name: "FK_DocumentTag_Documents_DocumentsGuid",
                        column: x => x.DocumentsGuid,
                        principalTable: "Documents",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DocumentTag_Tags_TagsGuid",
                        column: x => x.TagsGuid,
                        principalTable: "Tags",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentTag_TagsGuid",
                table: "DocumentTag",
                column: "TagsGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DocumentTag");

            migrationBuilder.AddColumn<Guid>(
                name: "DocumentGuid",
                table: "Tags",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tags_DocumentGuid",
                table: "Tags",
                column: "DocumentGuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Documents_DocumentGuid",
                table: "Tags",
                column: "DocumentGuid",
                principalTable: "Documents",
                principalColumn: "Guid");
        }
    }
}
