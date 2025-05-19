using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class aaa : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NguoiCapNhat",
                table: "PhieuNhapHangs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NguoiCapNhat",
                table: "PhieuNhapHangs");
        }
    }
}
