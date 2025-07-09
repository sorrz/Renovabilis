using System.ComponentModel.DataAnnotations;

namespace RenovaBills.API.Models
{
    public class WeatherData
    {
        [Key]
        public int Id { get; set; }
        
        public string Area { get; set; } = string.Empty;
        
        public DateTime Timestamp { get; set; }
        
        public double Temperature { get; set; }
        
        public double WindSpeed { get; set; }
    }
}