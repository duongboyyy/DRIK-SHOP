using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class them1sobang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id_CuaHang",
                table: "HoaDons",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoaiDon",
                table: "HoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MaCuaHang",
                table: "HoaDons",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id_CuaHang",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LoaiAccount",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CuaHang",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaCuaHang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenCuaHang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DiaChi = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Id_Kho = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CuaHang", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HoaDons_Id_CuaHang",
                table: "HoaDons",
                column: "Id_CuaHang");

            migrationBuilder.AddForeignKey(
                name: "FK_HoaDons_CuaHang_Id_CuaHang",
                table: "HoaDons",
                column: "Id_CuaHang",
                principalTable: "CuaHang",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HoaDons_CuaHang_Id_CuaHang",
                table: "HoaDons");

            migrationBuilder.DropTable(
                name: "CuaHang");

            migrationBuilder.DropIndex(
                name: "IX_HoaDons_Id_CuaHang",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "Id_CuaHang",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "LoaiDon",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "MaCuaHang",
                table: "HoaDons");

            migrationBuilder.DropColumn(
                name: "Id_CuaHang",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LoaiAccount",
                table: "AspNetUsers");
        }
    }
}
