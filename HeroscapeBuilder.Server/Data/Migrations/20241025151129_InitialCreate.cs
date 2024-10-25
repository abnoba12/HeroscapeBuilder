using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HeroscapeBuilder.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "creator",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Creator = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("Creator_pkey", x => new { x.id, x.Creator });
                    table.UniqueConstraint("AK_creator_Creator", x => x.Creator);
                });

            migrationBuilder.CreateTable(
                name: "terrain",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    hexes = table.Column<short>(type: "smallint", nullable: true),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("terrain_pkey", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "set",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    creator = table.Column<string>(type: "nvarchar(450)", nullable: false, defaultValue: "Heroscape"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    wave = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    release_date = table.Column<DateOnly>(type: "date", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    units_in_set = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("set_pkey", x => x.id);
                    table.ForeignKey(
                        name: "set_creator_fkey",
                        column: x => x.creator,
                        principalTable: "creator",
                        principalColumn: "Creator");
                });

            migrationBuilder.CreateTable(
                name: "army_card",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Creator = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    General = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Race = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Personality = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rarity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SizeCategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<long>(type: "bigint", nullable: true),
                    Life = table.Column<long>(type: "bigint", nullable: true),
                    AdvMove = table.Column<long>(type: "bigint", nullable: true),
                    AdvRange = table.Column<long>(type: "bigint", nullable: true),
                    AdvAttack = table.Column<long>(type: "bigint", nullable: true),
                    AdvDefense = table.Column<long>(type: "bigint", nullable: true),
                    Points = table.Column<long>(type: "bigint", nullable: true),
                    BasicMove = table.Column<long>(type: "bigint", nullable: true),
                    BasicRange = table.Column<long>(type: "bigint", nullable: true),
                    BasicAttack = table.Column<long>(type: "bigint", nullable: true),
                    BasicDefense = table.Column<long>(type: "bigint", nullable: true),
                    Planet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UnitNumbers = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Set = table.Column<long>(type: "bigint", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    STL_File = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("army_card_pkey", x => x.id);
                    table.ForeignKey(
                        name: "army_card_Creator_fkey",
                        column: x => x.Creator,
                        principalTable: "creator",
                        principalColumn: "Creator");
                    table.ForeignKey(
                        name: "army_card_Set_fkey",
                        column: x => x.Set,
                        principalTable: "set",
                        principalColumn: "id");
                },
                comment: "A list of stats and abilities for each unit in Heroscape");

            migrationBuilder.CreateTable(
                name: "set_terrain",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    set = table.Column<long>(type: "bigint", nullable: false),
                    terrain = table.Column<long>(type: "bigint", nullable: false),
                    quantity = table.Column<short>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("set_terrain_pkey", x => x.id);
                    table.ForeignKey(
                        name: "set_terrain_set_fkey",
                        column: x => x.set,
                        principalTable: "set",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "set_terrain_terrain_fkey",
                        column: x => x.terrain,
                        principalTable: "terrain",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "army_card_abilities",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    army_card_id = table.Column<int>(type: "int", nullable: false),
                    ability_name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ability = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("army_card_abilites_pkey", x => x.id);
                    table.ForeignKey(
                        name: "army_card_abilities_army_card_id_fkey",
                        column: x => x.army_card_id,
                        principalTable: "army_card",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "army_card_files",
                columns: table => new
                {
                    id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    army_card_id = table.Column<int>(type: "int", nullable: false),
                    file_purpose = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    file_path = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETDATE()"),
                    parent = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("army_card_files_pkey", x => x.id);
                    table.ForeignKey(
                        name: "army_card_files_army_card_id_fkey",
                        column: x => x.army_card_id,
                        principalTable: "army_card",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "army_card_files_parent_fkey",
                        column: x => x.parent,
                        principalTable: "army_card_files",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_army_card_Creator",
                table: "army_card",
                column: "Creator");

            migrationBuilder.CreateIndex(
                name: "IX_army_card_Set",
                table: "army_card",
                column: "Set");

            migrationBuilder.CreateIndex(
                name: "IX_army_card_abilities_army_card_id",
                table: "army_card_abilities",
                column: "army_card_id");

            migrationBuilder.CreateIndex(
                name: "IX_army_card_files_army_card_id",
                table: "army_card_files",
                column: "army_card_id");

            migrationBuilder.CreateIndex(
                name: "IX_army_card_files_parent",
                table: "army_card_files",
                column: "parent");

            migrationBuilder.CreateIndex(
                name: "Creator_Creator_key",
                table: "creator",
                column: "Creator",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_set_creator",
                table: "set",
                column: "creator");

            migrationBuilder.CreateIndex(
                name: "IX_set_terrain_set",
                table: "set_terrain",
                column: "set");

            migrationBuilder.CreateIndex(
                name: "IX_set_terrain_terrain",
                table: "set_terrain",
                column: "terrain");
        }

        /// <inheritdoc />
        /// dotnet ef database update 0
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "army_card_abilities");

            migrationBuilder.DropTable(
                name: "army_card_files");

            migrationBuilder.DropTable(
                name: "set_terrain");

            migrationBuilder.DropTable(
                name: "army_card");

            migrationBuilder.DropTable(
                name: "terrain");

            migrationBuilder.DropTable(
                name: "set");

            migrationBuilder.DropTable(
                name: "creator");
        }
    }
}
