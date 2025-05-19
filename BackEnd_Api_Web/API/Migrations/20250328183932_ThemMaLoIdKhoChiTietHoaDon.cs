using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class ThemMaLoIdKhoChiTietHoaDon : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id_Kho",
                table: "ChiTietHoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MaLo",
                table: "ChiTietHoaDons",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id_Kho",
                table: "ChiTietHoaDons");

            migrationBuilder.DropColumn(
                name: "MaLo",
                table: "ChiTietHoaDons");
        }
    }
}
