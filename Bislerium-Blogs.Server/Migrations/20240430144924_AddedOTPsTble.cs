using Microsoft.EntityFrameworkCore.Migrations;

namespace Bislerium_Blogs.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedOTPsTble : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
    name: "Otps",
    columns: table => new
    {
        OtpId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
        Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false), // Set a fixed length of 256 characters
        OtpCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
        CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
        UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Otps", x => x.OtpId);
        table.UniqueConstraint("UC_Email", x => x.Email);
    });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Otps");
        }
    }
}
