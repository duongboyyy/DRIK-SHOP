using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class quan : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdCTPNH",
                table: "SanPhamKho",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MaLo",
                table: "SanPhamKho",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayHetHan",
                table: "SanPhamKho",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgaySanXuat",
                table: "SanPhamKho",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CongNo",
                table: "PhieuNhapHangs",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsPayment",
                table: "PhieuNhapHangs",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SanPhamKho_IdCTPNH",
                table: "SanPhamKho",
                column: "IdCTPNH");

            migrationBuilder.AddForeignKey(
                name: "FK_SanPhamKho_ChiTietPhieuNhapHangs_IdCTPNH",
                table: "SanPhamKho",
                column: "IdCTPNH",
                principalTable: "ChiTietPhieuNhapHangs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SanPhamKho_ChiTietPhieuNhapHangs_IdCTPNH",
                table: "SanPhamKho");

            migrationBuilder.DropIndex(
                name: "IX_SanPhamKho_IdCTPNH",
                table: "SanPhamKho");

            migrationBuilder.DropColumn(
                name: "IdCTPNH",
                table: "SanPhamKho");

            migrationBuilder.DropColumn(
                name: "MaLo",
                table: "SanPhamKho");

            migrationBuilder.DropColumn(
                name: "NgayHetHan",
                table: "SanPhamKho");

            migrationBuilder.DropColumn(
                name: "NgaySanXuat",
                table: "SanPhamKho");

            migrationBuilder.DropColumn(
                name: "CongNo",
                table: "PhieuNhapHangs");

            migrationBuilder.DropColumn(
                name: "IsPayment",
                table: "PhieuNhapHangs");
        }
    }
}
