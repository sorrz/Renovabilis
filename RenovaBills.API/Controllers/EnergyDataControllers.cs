
using Microsoft.AspNetCore.Mvc;
using RenovaBills.API.Models;
using RenovaBills.API.Repositories;

namespace RenovaBills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnergyDataController : ControllerBase
    {
        private readonly IEnergyDataRepository _energyDataRepository;

        public EnergyDataController(IEnergyDataRepository energyDataRepository)
        {
            _energyDataRepository = energyDataRepository;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<EnergyData>>> GetEnergyData()
        {
            var energyData = await _energyDataRepository.GetAllAsync();
            return Ok(energyData);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<EnergyData>> GetEnergyData(int id)
        {
            var energyData = await _energyDataRepository.GetByIdAsync(id);

            if (energyData == null)
            {
                return NotFound();
            }

            return energyData;
        }


        [HttpGet("gridarea/{gridAreaId}")]
        public async Task<ActionResult<IEnumerable<EnergyData>>> GetEnergyDataByGridArea(int gridAreaId)
        {
            var energyData = await _energyDataRepository.GetByGridAreaAsync(gridAreaId);
            return Ok(energyData);
        }

        
        [HttpGet("daterange")]
        public async Task<ActionResult<IEnumerable<EnergyData>>> GetEnergyDataByDateRange(
            [FromQuery] DateTime startDate, 
            [FromQuery] DateTime endDate)
        {
            var energyData = await _energyDataRepository.GetByDateRangeAsync(startDate, endDate);
            return Ok(energyData);
        }


        [HttpPost]
        public async Task<ActionResult<EnergyData>> PostEnergyData(EnergyData energyData)
        {
            var createdEnergyData = await _energyDataRepository.CreateAsync(energyData);
            return CreatedAtAction(nameof(GetEnergyData), new { id = createdEnergyData.Id }, createdEnergyData);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutEnergyData(int id, EnergyData energyData)
        {
            if (id != energyData.Id)
            {
                return BadRequest();
            }

            var exists = await _energyDataRepository.ExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _energyDataRepository.UpdateAsync(energyData);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnergyData(int id)
        {
            var deleted = await _energyDataRepository.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}