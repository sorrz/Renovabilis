// Models/Forecast.cs
using System.ComponentModel.DataAnnotations;

namespace RenovaBills.API.Models
{
    public class Forecast
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public DateTime ForecastDate { get; set; }
        
        [Required]
        public double PredictedConsumptionKwh { get; set; }
        
        public double PredictedProductionKwh { get; set; }
        
        public double PredictedPricePerKwh { get; set; }
        
        [Required]
        public int GridAreaId { get; set; }
        
        // Navigation property
        public GridArea GridArea { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Required]
        [StringLength(50)]
        public string ForecastType { get; set; } = "Daily"; // Daily, Weekly, Monthly
    }
}