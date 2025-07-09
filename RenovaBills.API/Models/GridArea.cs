// Models/GridArea.cs
using System.ComponentModel.DataAnnotations;

namespace RenovaBills.API.Models
{
    public class GridArea
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Code { get; set; } = string.Empty; // SE1, SE2, SE3, SE4
        
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        
        public double Latitude { get; set; }
        
        public double Longitude { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<EnergyData> EnergyDataRecords { get; set; } = new List<EnergyData>();
        public ICollection<Forecast> Forecasts { get; set; } = new List<Forecast>();
    }
}