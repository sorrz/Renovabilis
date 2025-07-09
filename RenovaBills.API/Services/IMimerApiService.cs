// Services/IMimerApiService.cs
namespace RenovaBills.API.Services
{
    public interface IMimerApiService
    {
        Task<MimerPriceData?> GetCurrentPricesAsync();
        Task<MimerPriceData?> GetPricesByGridAreaAsync(string gridAreaCode);
        Task<List<MimerPriceData>> GetPriceForecastAsync(string gridAreaCode, int hours = 24);
    }

    public class MimerPriceData
    {
        public string GridArea { get; set; } = string.Empty;
        public double Price { get; set; }
        public string Currency { get; set; } = "SEK";
        public DateTime Timestamp { get; set; }
        public string Unit { get; set; } = "öre/kWh";
    }
}