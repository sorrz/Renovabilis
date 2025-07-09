using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RenovaBills.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GridAreas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Latitude = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    Longitude = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GridAreas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RenovaBills",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CustomerName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RenovaBills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EnergyData",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ConsumptionKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    ProductionKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    PricePerKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    GridAreaId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnergyData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnergyData_GridAreas_GridAreaId",
                        column: x => x.GridAreaId,
                        principalTable: "GridAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Forecasts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ForecastDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PredictedConsumptionKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    PredictedProductionKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    PredictedPricePerKwh = table.Column<double>(type: "decimal(18,6)", nullable: false),
                    GridAreaId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ForecastType = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forecasts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Forecasts_GridAreas_GridAreaId",
                        column: x => x.GridAreaId,
                        principalTable: "GridAreas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "GridAreas",
                columns: new[] { "Id", "Code", "CreatedAt", "Description", "Latitude", "Longitude", "Name" },
                values: new object[,]
                {
                    { 1, "SE1", new DateTime(2025, 7, 9, 3, 54, 34, 168, DateTimeKind.Utc).AddTicks(2190), "Luleå och norrut", 65.584818999999996, 22.154807999999999, "Norra Sverige" },
                    { 2, "SE2", new DateTime(2025, 7, 9, 3, 54, 34, 168, DateTimeKind.Utc).AddTicks(2200), "Sundsvall - Gävle", 62.390810999999999, 17.306927000000002, "Norra Mellansverige" },
                    { 3, "SE3", new DateTime(2025, 7, 9, 3, 54, 34, 168, DateTimeKind.Utc).AddTicks(2200), "Stockholm - Göteborg", 59.334591000000003, 18.06324, "Södra Mellansverige" },
                    { 4, "SE4", new DateTime(2025, 7, 9, 3, 54, 34, 168, DateTimeKind.Utc).AddTicks(2200), "Malmö och söderut", 55.604981000000002, 13.003822, "Södra Sverige" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_EnergyData_GridAreaId",
                table: "EnergyData",
                column: "GridAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_EnergyData_Timestamp",
                table: "EnergyData",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_Forecasts_ForecastDate",
                table: "Forecasts",
                column: "ForecastDate");

            migrationBuilder.CreateIndex(
                name: "IX_Forecasts_GridAreaId",
                table: "Forecasts",
                column: "GridAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_GridAreas_Code",
                table: "GridAreas",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnergyData");

            migrationBuilder.DropTable(
                name: "Forecasts");

            migrationBuilder.DropTable(
                name: "RenovaBills");

            migrationBuilder.DropTable(
                name: "GridAreas");
        }
    }
}
