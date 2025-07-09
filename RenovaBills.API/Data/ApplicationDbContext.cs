// Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;
using RenovaBills.API.Models;

namespace RenovaBills.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // DbSets för våra modeller
        public DbSet<RenovaBill> RenovaBills { get; set; }
        public DbSet<EnergyData> EnergyData { get; set; }
        public DbSet<Forecast> Forecasts { get; set; }
        public DbSet<GridArea> GridAreas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure RenovaBill
            modelBuilder.Entity<RenovaBill>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CustomerName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            });

            // Configure EnergyData
            modelBuilder.Entity<EnergyData>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ConsumptionKwh).HasColumnType("decimal(18,6)");
                entity.Property(e => e.ProductionKwh).HasColumnType("decimal(18,6)");
                entity.Property(e => e.PricePerKwh).HasColumnType("decimal(18,6)");
                
                // Foreign key relationship
                entity.HasOne(e => e.GridArea)
                      .WithMany(g => g.EnergyDataRecords)
                      .HasForeignKey(e => e.GridAreaId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Index för prestanda
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.GridAreaId);
            });

            // Configure Forecast
            modelBuilder.Entity<Forecast>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PredictedConsumptionKwh).HasColumnType("decimal(18,6)");
                entity.Property(e => e.PredictedProductionKwh).HasColumnType("decimal(18,6)");
                entity.Property(e => e.PredictedPricePerKwh).HasColumnType("decimal(18,6)");
                
                // Foreign key relationship
                entity.HasOne(e => e.GridArea)
                      .WithMany(g => g.Forecasts)
                      .HasForeignKey(e => e.GridAreaId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Index för prestanda
                entity.HasIndex(e => e.ForecastDate);
                entity.HasIndex(e => e.GridAreaId);
            });

            // Configure GridArea
            modelBuilder.Entity<GridArea>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Latitude).HasColumnType("decimal(18,6)");
                entity.Property(e => e.Longitude).HasColumnType("decimal(18,6)");
                
                // Unique constraint på Code
                entity.HasIndex(e => e.Code).IsUnique();
            });

            // Seed data för GridAreas (Svenska elområden)
            modelBuilder.Entity<GridArea>().HasData(
                new GridArea { Id = 1, Code = "SE1", Name = "Norra Sverige", Description = "Luleå och norrut", Latitude = 65.584819, Longitude = 22.154808 },
                new GridArea { Id = 2, Code = "SE2", Name = "Norra Mellansverige", Description = "Sundsvall - Gävle", Latitude = 62.390811, Longitude = 17.306927 },
                new GridArea { Id = 3, Code = "SE3", Name = "Södra Mellansverige", Description = "Stockholm - Göteborg", Latitude = 59.334591, Longitude = 18.063240 },
                new GridArea { Id = 4, Code = "SE4", Name = "Södra Sverige", Description = "Malmö och söderut", Latitude = 55.604981, Longitude = 13.003822 }
            );
        }
    }
}