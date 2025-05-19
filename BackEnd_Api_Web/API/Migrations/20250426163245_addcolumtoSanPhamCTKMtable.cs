using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class addcolumtoSanPhamCTKMtable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "GiaKhuyenMai",
                table: "SanPhamCTKM",
                type: "decimal(18,0)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "SanPhamCTKM",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "SanPhamCTKM",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiaKhuyenMai",
                table: "SanPhamCTKM");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "SanPhamCTKM");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "SanPhamCTKM");
        }
    }
}
