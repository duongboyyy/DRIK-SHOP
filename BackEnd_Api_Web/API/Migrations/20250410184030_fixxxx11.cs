using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class fixxxx11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuocHoan",
                table: "PhieuHoanHang");

            migrationBuilder.AddColumn<bool>(
                name: "DuocHoan",
                table: "ChiTietPhieuHoanHang",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuocHoan",
                table: "ChiTietPhieuHoanHang");

            migrationBuilder.AddColumn<bool>(
                name: "DuocHoan",
                table: "PhieuHoanHang",
                type: "bit",
                nullable: true);
        }
    }
}
