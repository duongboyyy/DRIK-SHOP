using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ThemTenKhachHangSDTTrongHoaDon : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SDT",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TenKhachHang",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SDT",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "TenKhachHang",
                table: "HoaDons");
        }
    }
}
