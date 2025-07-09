// Services/MimerApiService.cs
using System.Text.Json;

namespace RenovaBills.API.Services
{
    public class MimerApiService : IMimerApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<MimerApiService> _logger;
        private readonly string _baseUrl;

        public MimerApiService(HttpClient httpClient, ILogger<MimerApiService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _baseUrl = configuration["ExternalApis:Mimer:BaseUrl"] ?? "https://www.svk.se/services";
            
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "RenovaBills-API/1.0");
        }

        public async Task<MimerPriceData?> GetCurrentPricesAsync()
        {
            try
            {
                // För demo: returnera mock-data tills vi får rätt MIMER endpoint
                return new MimerPriceData
                {
                    GridArea = "SE3",
                    Price = 85.5,
                    Currency = "SEK",
                    Timestamp = DateTime.UtcNow,
                    Unit = "öre/kWh"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current prices from MIMER API");
                return null;
            }
        }

        public async Task<MimerPriceData?> GetPricesByGridAreaAsync(string gridAreaCode)
        {
            try
            {
                // Mock-data baserat på nätområde
                var basePrice = gridAreaCode switch
                {
                    "SE1" => 65.2,
                    "SE2" => 72.8,
                    "SE3" => 85.5,
                    "SE4" => 95.3,
                    _ => 80.0
                };

                return new MimerPriceData
                {
                    GridArea = gridAreaCode,
                    Price = basePrice,
                    Currency = "SEK",
                    Timestamp = DateTime.UtcNow,
                    Unit = "öre/kWh"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching prices for grid area {GridArea} from MIMER API", gridAreaCode);
                return null;
            }
        }

        public async Task<List<MimerPriceData>> GetPriceForecastAsync(string gridAreaCode, int hours = 24)
        {
            try
            {
                var forecast = new List<MimerPriceData>();
                var basePrice = await GetPricesByGridAreaAsync(gridAreaCode);
                
                if (basePrice != null)
                {
                    for (int i = 0; i < hours; i++)
                    {
                        // Skapa mock-prognos med variation
                        var variation = Random.Shared.NextDouble() * 20 - 10; // ±10%
                        forecast.Add(new MimerPriceData
                        {
                            GridArea = gridAreaCode,
                            Price = Math.Max(0, basePrice.Price + variation),
                            Currency = "SEK",
                            Timestamp = DateTime.UtcNow.AddHours(i),
                            Unit = "öre/kWh"
                        });
                    }
                }

                return forecast;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching price forecast for grid area {GridArea} from MIMER API", gridAreaCode);
                return new List<MimerPriceData>();
            }
        }
    }
}