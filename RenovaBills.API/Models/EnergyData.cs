// Models/EnergyData.cs
using System.ComponentModel.DataAnnotations;

namespace RenovaBills.API.Models
{
    public class EnergyData
    {
        [Key]
        public int Id { get; set; }
        
        public DateTime Timestamp { get; set; }
        
        [Required]
        public double ConsumptionKwh { get; set; }
        
        public double ProductionKwh { get; set; }
        
        public double PricePerKwh { get; set; }
        
        [Required]
        public int GridAreaId { get; set; }
        
        // Navigation property
        public GridArea GridArea { get; set; } = null!;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}