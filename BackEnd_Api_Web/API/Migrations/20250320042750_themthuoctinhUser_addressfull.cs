using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class themthuoctinhUser_addressfull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiaChiFull",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaChiFull",
                table: "AspNetUsers");
        }
    }
}
