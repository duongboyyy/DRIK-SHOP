using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class addProperties_kho : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Huyen",
                table: "Kho",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lat",
                table: "Kho",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Lng",
                table: "Kho",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tinh",
                table: "Kho",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Xa",
                table: "Kho",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Huyen",
                table: "Kho");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Kho");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Kho");

            migrationBuilder.DropColumn(
                name: "Tinh",
                table: "Kho");

            migrationBuilder.DropColumn(
                name: "Xa",
                table: "Kho");
        }
    }
}
