using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class addCoLumnImageToCTKMTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "CTKMs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "CTKMs");
        }
    }
}
