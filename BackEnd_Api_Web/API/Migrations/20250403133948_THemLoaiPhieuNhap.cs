using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class THemLoaiPhieuNhap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LoaiPhieu",
                table: "PhieuNhapHangs",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LoaiDon",
                table: "HoaDons",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoaiPhieu",
                table: "PhieuNhapHangs");

            migrationBuilder.AlterColumn<int>(
                name: "LoaiDon",
                table: "HoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
