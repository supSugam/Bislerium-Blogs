using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bislerium_Blogs.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedThumbnailField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.AddColumn<string>(
                name: "Thumbnail",
                table: "BlogPosts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Thumbnail",
                table: "BlogPosts");

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    ImageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "(newid())"),
                    BlogPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Images__7516F70CE6D39443", x => x.ImageId);
                    table.ForeignKey(
                        name: "FK__Images__BlogPost__571DF1D5",
                        column: x => x.BlogPostId,
                        principalTable: "BlogPosts",
                        principalColumn: "BlogPostId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Images_BlogPostId",
                table: "Images",
                column: "BlogPostId");
        }
    }
}
