using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class fixHoanHang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id_Kho",
                table: "ChiTietPhieuHoanHang",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id_SanPhamBienThe",
                table: "ChiTietPhieuHoanHang",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaLo",
                table: "ChiTietPhieuHoanHang",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id_Kho",
                table: "ChiTietPhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "Id_SanPhamBienThe",
                table: "ChiTietPhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "MaLo",
                table: "ChiTietPhieuHoanHang");
        }
    }
}
