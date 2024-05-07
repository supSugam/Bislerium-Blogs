using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium_Blogs.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedBlog_History_Schema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChangesSummary",
                table: "BlogPostHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "BlogPostHistory",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "BlogPostHistoryTag",
                columns: table => new
                {
                    BlogPostHistoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TagId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPostHistoryTag", x => new { x.BlogPostHistoryId, x.TagId });
                    table.ForeignKey(
                        name: "FK_BlogPostHistoryTag_BlogPostHistory_BlogPostHistoryId",
                        column: x => x.BlogPostHistoryId,
                        principalTable: "BlogPostHistory",
                        principalColumn: "BlogPostHistoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BlogPostHistoryTag_Tags_TagId",
                        column: x => x.TagId,
                        principalTable: "Tags",
                        principalColumn: "TagId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogPostHistoryTag_TagId",
                table: "BlogPostHistoryTag",
                column: "TagId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogPostHistoryTag");

            migrationBuilder.DropColumn(
                name: "ChangesSummary",
                table: "BlogPostHistory");

            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "BlogPostHistory");
        }
    }
}
