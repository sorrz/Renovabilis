
using System.ComponentModel.DataAnnotations;

namespace RenovaBills.API.Models
{
    public class RenovaBill
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CustomerName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Address { get; set; } = string.Empty;
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public DateTime DueDate { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Completed, Overdue
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}