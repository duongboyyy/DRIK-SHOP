using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ThemPhieuHoanHang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRefundAll",
                table: "ChiTietHoaDons",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SoLuongHoan",
                table: "ChiTietHoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRefundAll",
                table: "ChiTietHoaDons");

            migrationBuilder.DropColumn(
                name: "SoLuongHoan",
                table: "ChiTietHoaDons");
        }
    }
}
