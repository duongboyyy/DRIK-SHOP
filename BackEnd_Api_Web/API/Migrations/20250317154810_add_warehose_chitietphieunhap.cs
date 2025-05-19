using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class add_warehose_chitietphieunhap : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id_Kho",
                table: "ChiTietPhieuNhapHangs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuNhapHangs_Id_Kho",
                table: "ChiTietPhieuNhapHangs",
                column: "Id_Kho");

            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietPhieuNhapHangs_Kho_Id_Kho",
                table: "ChiTietPhieuNhapHangs",
                column: "Id_Kho",
                principalTable: "Kho",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietPhieuNhapHangs_Kho_Id_Kho",
                table: "ChiTietPhieuNhapHangs");

            migrationBuilder.DropIndex(
                name: "IX_ChiTietPhieuNhapHangs_Id_Kho",
                table: "ChiTietPhieuNhapHangs");

            migrationBuilder.DropColumn(
                name: "Id_Kho",
                table: "ChiTietPhieuNhapHangs");
        }
    }
}
