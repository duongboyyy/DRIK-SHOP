using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class malo_chitiet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaLo",
                table: "ChiTietPhieuNhapHangs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaLo",
                table: "ChiTietPhieuNhapHangs");
        }
    }
}
