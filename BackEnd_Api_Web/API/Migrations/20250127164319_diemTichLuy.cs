using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class diemTichLuy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Point",
                table: "AspNetUsers",
                type: "float",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Point",
                table: "AspNetUsers");
        }
    }
}
