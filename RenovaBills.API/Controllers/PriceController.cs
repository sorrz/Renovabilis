// Controllers/PriceController.cs
using Microsoft.AspNetCore.Mvc;
using RenovaBills.API.Services;

namespace RenovaBills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceController : ControllerBase
    {
        private readonly IMimerApiService _mimerApiService;
        private readonly ILogger<PriceController> _logger;

        public PriceController(IMimerApiService mimerApiService, ILogger<PriceController> logger)
        {
            _mimerApiService = mimerApiService;
            _logger = logger;
        }

        /// <summary>
        /// Hämta aktuella elpriser
        /// </summary>
        [HttpGet("current")]
        public async Task<ActionResult<MimerPriceData>> GetCurrentPrices()
        {
            try
            {
                var prices = await _mimerApiService.GetCurrentPricesAsync();
                if (prices == null)
                {
                    return NotFound("Kunde inte hämta aktuella priser");
                }
                return Ok(prices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching current prices");
                return StatusCode(500, "Fel vid hämtning av priser");
            }
        }

        /// <summary>
        /// Hämta elpriser för specifikt nätområde
        /// </summary>
        [HttpGet("gridarea/{gridAreaCode}")]
        public async Task<ActionResult<MimerPriceData>> GetPricesByGridArea(string gridAreaCode)
        {
            try
            {
                var prices = await _mimerApiService.GetPricesByGridAreaAsync(gridAreaCode);
                if (prices == null)
                {
                    return NotFound($"Kunde inte hämta priser för {gridAreaCode}");
                }
                return Ok(prices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching prices for grid area {GridArea}", gridAreaCode);
                return StatusCode(500, "Fel vid hämtning av priser");
            }
        }

        /// <summary>
        /// Hämta prisprognos för nätområde
        /// </summary>
        [HttpGet("forecast/{gridAreaCode}")]
        public async Task<ActionResult<List<MimerPriceData>>> GetPriceForecast(
            string gridAreaCode, 
            [FromQuery] int hours = 24)
        {
            try
            {
                var forecast = await _mimerApiService.GetPriceForecastAsync(gridAreaCode, hours);
                return Ok(forecast);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching price forecast for grid area {GridArea}", gridAreaCode);
                return StatusCode(500, "Fel vid hämtning av prisprognos");
            }
        }

        /// <summary>
        /// Hämta priser för alla svenska nätområden
        /// </summary>
        [HttpGet("all-areas")]
        public async Task<ActionResult<List<MimerPriceData>>> GetAllAreaPrices()
        {
            try
            {
                var areas = new[] { "SE1", "SE2", "SE3", "SE4" };
                var allPrices = new List<MimerPriceData>();

                foreach (var area in areas)
                {
                    var price = await _mimerApiService.GetPricesByGridAreaAsync(area);
                    if (price != null)
                    {
                        allPrices.Add(price);
                    }
                }

                return Ok(allPrices);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching prices for all grid areas");
                return StatusCode(500, "Fel vid hämtning av priser");
            }
        }
    }
}