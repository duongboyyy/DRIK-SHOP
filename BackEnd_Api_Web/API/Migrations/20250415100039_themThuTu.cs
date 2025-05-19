using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class themThuTu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ThuTu",
                table: "Loais",
                type: "int",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThuTu",
                table: "Loais");
        }
    }
}
