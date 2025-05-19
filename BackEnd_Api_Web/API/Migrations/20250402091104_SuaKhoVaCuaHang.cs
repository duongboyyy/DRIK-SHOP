using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class SuaKhoVaCuaHang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id_Kho",
                table: "CuaHang");

            migrationBuilder.AddColumn<int>(
                name: "IdCuaHang",
                table: "Kho",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Kho_IdCuaHang",
                table: "Kho",
                column: "IdCuaHang");

            migrationBuilder.AddForeignKey(
                name: "FK_Kho_CuaHang_IdCuaHang",
                table: "Kho",
                column: "IdCuaHang",
                principalTable: "CuaHang",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kho_CuaHang_IdCuaHang",
                table: "Kho");

            migrationBuilder.DropIndex(
                name: "IX_Kho_IdCuaHang",
                table: "Kho");

            migrationBuilder.DropColumn(
                name: "IdCuaHang",
                table: "Kho");

            migrationBuilder.AddColumn<int>(
                name: "Id_Kho",
                table: "CuaHang",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
