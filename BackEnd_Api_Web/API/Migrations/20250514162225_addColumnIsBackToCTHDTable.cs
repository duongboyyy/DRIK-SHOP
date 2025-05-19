using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class addColumnIsBackToCTHDTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBack",
                table: "ChiTietHoaDons",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBack",
                table: "ChiTietHoaDons");
        }
    }
}
