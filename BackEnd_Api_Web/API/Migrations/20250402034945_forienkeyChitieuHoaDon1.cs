using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class forienkeyChitieuHoaDon1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // XÓA CỘT CŨ
            migrationBuilder.DropColumn(
                name: "HoaDonId",
                table: "ChiTietHoaDons");

            // TẠO INDEX MỚI
            migrationBuilder.CreateIndex(
                name: "IX_ChiTietHoaDons_Id_HoaDon",
                table: "ChiTietHoaDons",
                column: "Id_HoaDon");

            // THÊM KHÓA NGOẠI MỚI
            migrationBuilder.AddForeignKey(
                name: "FK_ChiTietHoaDons_HoaDons_Id_HoaDon",
                table: "ChiTietHoaDons",
                column: "Id_HoaDon",
                principalTable: "HoaDons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // XÓA KHÓA NGOẠI MỚI
            migrationBuilder.DropForeignKey(
                name: "FK_ChiTietHoaDons_HoaDons_Id_HoaDon",
                table: "ChiTietHoaDons");

            // XÓA INDEX MỚI
            migrationBuilder.DropIndex(
                name: "IX_ChiTietHoaDons_Id_HoaDon",
                table: "ChiTietHoaDons");

            // THÊM LẠI CỘT CŨ
            migrationBuilder.AddColumn<int>(
                name: "HoaDonId",
                table: "ChiTietHoaDons",
                type: "int",
                nullable: true);

            // THÊM INDEX CŨ
            migrationBuilder.CreateIndex(
                name: "IX_ChiTietHoaDons_HoaDonId",
                table: "ChiTietHoaDons",
                column: "HoaDonId");
        }
    }
}
