using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class hoahang : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdHoaDon",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "IdSanPham",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "SoLuongHoan",
                table: "ChiTietHoaDons");

            migrationBuilder.RenameColumn(
                name: "SoLuongHoan",
                table: "PhieuHoanHang",
                newName: "TrangThai");

            migrationBuilder.RenameColumn(
                name: "IdSanPhamBienThe",
                table: "PhieuHoanHang",
                newName: "Id_HoaDon");

            migrationBuilder.AddColumn<string>(
                name: "Id_User",
                table: "PhieuHoanHang",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LyDo",
                table: "PhieuHoanHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaPhieuHoan",
                table: "PhieuHoanHang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayHoan",
                table: "PhieuHoanHang",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "TongTienHoan",
                table: "PhieuHoanHang",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "SoLuongDaHoan",
                table: "ChiTietHoaDons",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ChiTietPhieuHoanHang",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Id_PhieuHoanHang = table.Column<int>(type: "int", nullable: false),
                    Id_ChiTietHoaDon = table.Column<int>(type: "int", nullable: false),
                    SoLuongHoan = table.Column<int>(type: "int", nullable: false),
                    DonGiaHoan = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiTietPhieuHoanHang", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuHoanHang_ChiTietHoaDons_Id_ChiTietHoaDon",
                        column: x => x.Id_ChiTietHoaDon,
                        principalTable: "ChiTietHoaDons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiTietPhieuHoanHang_PhieuHoanHang_Id_PhieuHoanHang",
                        column: x => x.Id_PhieuHoanHang,
                        principalTable: "PhieuHoanHang",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PhieuHoanHang_Id_HoaDon",
                table: "PhieuHoanHang",
                column: "Id_HoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuHoanHang_Id_User",
                table: "PhieuHoanHang",
                column: "Id_User");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuHoanHang_Id_ChiTietHoaDon",
                table: "ChiTietPhieuHoanHang",
                column: "Id_ChiTietHoaDon");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietPhieuHoanHang_Id_PhieuHoanHang",
                table: "ChiTietPhieuHoanHang",
                column: "Id_PhieuHoanHang");

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuHoanHang_AspNetUsers_Id_User",
                table: "PhieuHoanHang",
                column: "Id_User",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PhieuHoanHang_HoaDons_Id_HoaDon",
                table: "PhieuHoanHang",
                column: "Id_HoaDon",
                principalTable: "HoaDons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhieuHoanHang_AspNetUsers_Id_User",
                table: "PhieuHoanHang");

            migrationBuilder.DropForeignKey(
                name: "FK_PhieuHoanHang_HoaDons_Id_HoaDon",
                table: "PhieuHoanHang");

            migrationBuilder.DropTable(
                name: "ChiTietPhieuHoanHang");

            migrationBuilder.DropIndex(
                name: "IX_PhieuHoanHang_Id_HoaDon",
                table: "PhieuHoanHang");

            migrationBuilder.DropIndex(
                name: "IX_PhieuHoanHang_Id_User",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "Id_User",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "LyDo",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "MaPhieuHoan",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "NgayHoan",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "TongTienHoan",
                table: "PhieuHoanHang");

            migrationBuilder.DropColumn(
                name: "SoLuongDaHoan",
                table: "ChiTietHoaDons");

            migrationBuilder.RenameColumn(
                name: "TrangThai",
                table: "PhieuHoanHang",
                newName: "SoLuongHoan");

            migrationBuilder.RenameColumn(
                name: "Id_HoaDon",
                table: "PhieuHoanHang",
                newName: "IdSanPhamBienThe");

            migrationBuilder.AddColumn<int>(
                name: "IdHoaDon",
                table: "PhieuHoanHang",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdSanPham",
                table: "PhieuHoanHang",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoLuongHoan",
                table: "ChiTietHoaDons",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
