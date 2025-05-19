using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class FixTrangThai : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Test",
                table: "PhieuHoanHang");

            migrationBuilder.AddColumn<string>(
                name: "NoteTrangThai",
                table: "PhieuHoanHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SanPhamBienTheId",
                table: "ChiTietPhieuHoanHang",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NoteTrangThai",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "SanPhamBienTheId",
                table: "ChiTietPhieuHoanHang");

            migrationBuilder.AddColumn<bool>(
                name: "Test",
                table: "PhieuHoanHang",
                type: "bit",
                nullable: true);
        }
    }
}
