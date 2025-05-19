using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ThemIdCuaHang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id_CuaHang",
                table: "PhieuHoanHang",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id_CuaHang",
                table: "PhieuHoanHang");
        }
    }
}
