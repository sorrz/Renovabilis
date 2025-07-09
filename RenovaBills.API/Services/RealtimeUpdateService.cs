// Services/RealtimeUpdateService.cs
using Microsoft.EntityFrameworkCore;
using RenovaBills.API.Data;
using RenovaBills.API.Models;

namespace RenovaBills.API.Services
{
    public class RealtimeUpdateService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RealtimeUpdateService> _logger;
        private readonly TimeSpan _updateInterval = TimeSpan.FromSeconds(120); // 120 sekunder

        public RealtimeUpdateService(IServiceProvider serviceProvider, ILogger<RealtimeUpdateService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Realtidsuppdateringar startade med 120s intervall");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await UpdateRealtimeDataAsync();
                    await Task.Delay(_updateInterval, stoppingToken);
                }
                catch (TaskCanceledException)
                {
                    _logger.LogInformation("Realtidsuppdateringar stoppade");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Fel vid realtidsuppdatering");
                    await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // Vänta 30s vid fel
                }
            }
        }

        private async Task UpdateRealtimeDataAsync()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var mimerService = scope.ServiceProvider.GetRequiredService<IMimerApiService>();

            _logger.LogInformation("Startar realtidsuppdatering av elpriser...");

            try
            {
                // Hämta alla nätområden
                var gridAreas = await context.GridAreas.ToListAsync();

                foreach (var gridArea in gridAreas)
                {
                    // Hämta aktuella priser för varje område
                    var priceData = await mimerService.GetPricesByGridAreaAsync(gridArea.Code);
                    
                    if (priceData != null)
                    {
                        // Skapa ny EnergyData post med aktuella priser
                        var energyData = new EnergyData
                        {
                            GridAreaId = gridArea.Id,
                            Timestamp = DateTime.UtcNow,
                            PricePerKwh = priceData.Price,
                            ConsumptionKwh = GenerateMockConsumption(gridArea.Code),
                            ProductionKwh = GenerateMockProduction(gridArea.Code),
                            CreatedAt = DateTime.UtcNow
                        };

                        context.EnergyData.Add(energyData);
                        
                        _logger.LogInformation("Uppdaterade {GridArea}: {Price} öre/kWh", 
                            gridArea.Code, priceData.Price);
                    }

                    // Lägg till lite delay mellan områden för att inte överbelasta
                    await Task.Delay(500);
                }

                await context.SaveChangesAsync();
                
                _logger.LogInformation("Realtidsuppdatering slutförd för alla {Count} nätområden", gridAreas.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fel vid uppdatering av realtidsdata");
            }
        }

        private double GenerateMockConsumption(string gridAreaCode)
        {
            // Generera realistisk konsumption baserat på område och tid
            var baseConsumption = gridAreaCode switch
            {
                "SE1" => 1200.0, // Norra Sverige - lägre befolkning
                "SE2" => 1800.0, // Norra Mellansverige
                "SE3" => 3500.0, // Södra Mellansverige - Stockholm området
                "SE4" => 2200.0, // Södra Sverige
                _ => 2000.0
            };

            // Lägg till variation baserat på tid på dagen
            var hour = DateTime.Now.Hour;
            var timeMultiplier = hour switch
            {
                >= 6 and < 9 => 1.3,   // Morgonrush
                >= 17 and < 20 => 1.4, // Kvällsrush
                >= 22 or < 6 => 0.7,   // Natt
                _ => 1.0               // Dag
            };

            // Lägg till slumpmässig variation (±10%)
            var randomVariation = 1.0 + (Random.Shared.NextDouble() - 0.5) * 0.2;
            
            return Math.Round(baseConsumption * timeMultiplier * randomVariation, 2);
        }

        private double GenerateMockProduction(string gridAreaCode)
        {
            // Generera realistisk produktion (sol/vind/vatten)
            var baseProduction = gridAreaCode switch
            {
                "SE1" => 1800.0, // Norra Sverige - mycket vattenkraft
                "SE2" => 1500.0, // Norra Mellansverige - vattenkraft + vindkraft
                "SE3" => 800.0,  // Södra Mellansverige - mindre förnybar
                "SE4" => 600.0,  // Södra Sverige - vindkraft offshore
                _ => 1000.0
            };

            // Variation baserat på tid (sol + vind)
            var hour = DateTime.Now.Hour;
            var timeMultiplier = hour switch
            {
                >= 10 and < 16 => 1.2, // Dagtid - mer sol
                >= 0 and < 6 => 1.1,   // Natt - mer vind
                _ => 1.0
            };

            var randomVariation = 1.0 + (Random.Shared.NextDouble() - 0.5) * 0.3; // ±15%
            
            return Math.Round(baseProduction * timeMultiplier * randomVariation, 2);
        }
    }
}