using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class fixxxaaa : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GhiChuHoanHang",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "IdParent",
                table: "HoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TypeHoaDon",
                table: "HoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GhiChuHoanHang",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "IdParent",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "TypeHoaDon",
                table: "HoaDons");
        }
    }
}
