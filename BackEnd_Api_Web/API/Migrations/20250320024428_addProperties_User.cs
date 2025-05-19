using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class addProperties_User : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Huyen",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tinh",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Xa",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Huyen",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Tinh",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Xa",
                table: "AspNetUsers");
        }
    }
}
