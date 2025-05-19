using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class sanPhamHoan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRefund",
                table: "ChiTietHoaDons",
                type: "bit",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRefund",
                table: "ChiTietHoaDons");
        }
    }
}
