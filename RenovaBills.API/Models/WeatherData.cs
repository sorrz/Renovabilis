namespace RenovaBills.API.Models
{
    public class WeatherData
    {
        public int Id { get; set; }
        public string Area { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double Temperature { get; set; }
        public double WindSpeed { get; set; }
    }

    public class EnergyData
    {
        public int Id { get; set; }
        public string Area { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public double Production { get; set; }
        public double Consumption { get; set; }
    }
}