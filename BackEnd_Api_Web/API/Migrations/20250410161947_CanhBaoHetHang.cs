using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class CanhBaoHetHang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SoLuongCanhBao",
                table: "SanPhamKho",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoLuongCanhBao",
                table: "SanPhamKho");
        }
    }
}
