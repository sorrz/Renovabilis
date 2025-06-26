using Microsoft.AspNetCore.Mvc;
using RenovaBills.API.Models;

namespace RenovaBills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetWeatherData()
        {
            var data = new List<WeatherData>
            {
                new WeatherData 
                { 
                    Id = 1, 
                    Area = "SE1", 
                    Temperature = 15.5, 
                    WindSpeed = 8.2,
                    Timestamp = DateTime.Now
                }
            };
            return Ok(data);
        }
    }
}