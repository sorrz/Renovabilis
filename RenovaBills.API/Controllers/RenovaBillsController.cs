using Microsoft.AspNetCore.Mvc;

namespace RenovaBills.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RenovaBillsController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Renovabilis Energy API", version = "1.0", timestamp = DateTime.Now });
    }
    [HttpGet("energy-data")]
    public IActionResult GetEnergyData()
    {
        var energyData = new[]
        {
            new {
                id = 1,
                gridArea = "SE1",
                areaName = "Norra Sverige",
                timestamp = "2025-06-25T13:00:00",
                weatherData = new {
                    temperature = 8.5,
                    windSpeed = 12.3,
                    cloudCover = 45,
                    humidity = 72
                },
                energyProduction = new {
                    wind = 850.2,
                    solar = 120.5,
                    hydro = 1200.8,
                    total = 2171.5
                },
                energyConsumption = new {
                    residential = 680.3,
                    industrial = 1150.7,
                    commercial = 340.5,
                    total = 2171.5
                },
                pricePerMWh = 425.60
            },
            new {
                id = 2,
                gridArea = "SE2",
                areaName = "Mellansverige",
                timestamp = "2025-06-25T13:00:00",
                weatherData = new {
                    temperature = 12.8,
                    windSpeed = 8.7,
                    cloudCover = 60,
                    humidity = 65
                },
                energyProduction = new {
                    wind = 520.4,
                    solar = 280.3,
                    hydro = 890.2,
                    total = 1690.9
                },
                energyConsumption = new {
                    residential = 890.5,
                    industrial = 1420.8,
                    commercial = 485.2,
                    total = 2796.5
                },
                pricePerMWh = 520.80
            },
            new {
                id = 3,
                gridArea = "SE3",
                areaName = "Stockholmsområdet",
                timestamp = "2025-06-25T13:00:00",
                weatherData = new {
                    temperature = 15.2,
                    windSpeed = 6.4,
                    cloudCover = 35,
                    humidity = 58
                },
                energyProduction = new {
                    wind = 180.7,
                    solar = 420.6,
                    hydro = 250.3,
                    total = 851.6
                },
                energyConsumption = new {
                    residential = 1240.8,
                    industrial = 980.5,
                    commercial = 760.3,
                    total = 2981.6
                },
                pricePerMWh = 680.40
            },
            new {
                id = 4,
                gridArea = "SE4",
                areaName = "Södra Sverige",
                timestamp = "2025-06-25T13:00:00",
                weatherData = new {
                    temperature = 18.5,
                    windSpeed = 15.8,
                    cloudCover = 25,
                    humidity = 52
                },
                energyProduction = new {
                    wind = 1200.5,
                    solar = 580.4,
                    hydro = 320.8,
                    total = 2101.7
                },
                energyConsumption = new {
                    residential = 780.2,
                    industrial = 1850.7,
                    commercial = 420.8,
                    total = 3051.7
                },
                pricePerMWh = 590.20
            }
        };

        return Ok(energyData);
    }

    [HttpGet("forecast")]
    public IActionResult GetForecastData()
    {
        var forecast = new[]
        {
            new {
                gridArea = "SE1",
                timeSlot = "2025-06-25T14:00:00",
                forecast = new {
                    windProduction = 920.5,
                    solarProduction = 95.2,
                    totalConsumption = 2250.8,
                    price = 445.80
                },
                confidence = 0.85
            },
            new {
                gridArea = "SE2", 
                timeSlot = "2025-06-25T14:00:00",
                forecast = new {
                    windProduction = 580.3,
                    solarProduction = 310.7,
                    totalConsumption = 2850.5,
                    price = 540.60
                },
                confidence = 0.78
            }
        };

        return Ok(forecast);
    }

    [HttpGet("grid-areas")]
    public IActionResult GetGridAreas()
    {
        var gridAreas = new[]
        {
            new {
                code = "SE1",
                name = "Norra Sverige",
                coordinates = new { lat = 65.5848, lng = 22.1547 },
                color = "#2E8B57"
            },
            new {
                code = "SE2", 
                name = "Mellansverige",
                coordinates = new { lat = 62.3875, lng = 16.3258 },
                color = "#4682B4"
            },
            new {
                code = "SE3",
                name = "Stockholmsområdet", 
                coordinates = new { lat = 59.3293, lng = 18.0686 },
                color = "#DC143C"
            },
            new {
                code = "SE4",
                name = "Södra Sverige",
                coordinates = new { lat = 55.6050, lng = 13.0038 },
                color = "#FF8C00"
            }
        };

        return Ok(gridAreas);
    }
}