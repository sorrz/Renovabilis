// Controllers/GridAreaController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RenovaBills.API.Data;
using RenovaBills.API.Models;

namespace RenovaBills.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GridAreaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GridAreaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/gridarea
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GridArea>>> GetGridAreas()
        {
            return await _context.GridAreas.ToListAsync();
        }

        // GET: api/gridarea/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GridArea>> GetGridArea(int id)
        {
            var gridArea = await _context.GridAreas.FindAsync(id);

            if (gridArea == null)
            {
                return NotFound();
            }

            return gridArea;
        }

        // GET: api/gridarea/code/SE1
        [HttpGet("code/{code}")]
        public async Task<ActionResult<GridArea>> GetGridAreaByCode(string code)
        {
            var gridArea = await _context.GridAreas
                .FirstOrDefaultAsync(g => g.Code == code);

            if (gridArea == null)
            {
                return NotFound();
            }

            return gridArea;
        }
    }
}