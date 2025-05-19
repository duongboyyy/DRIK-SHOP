using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class duocHoan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DuocHoan",
                table: "PhieuHoanHang",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DuocHoan",
                table: "PhieuHoanHang");
        }
    }
}
