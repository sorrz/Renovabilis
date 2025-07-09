// Repositories/EnergyDataRepository.cs
using Microsoft.EntityFrameworkCore;
using RenovaBills.API.Data;
using RenovaBills.API.Models;

namespace RenovaBills.API.Repositories
{
    public class EnergyDataRepository : IEnergyDataRepository
    {
        private readonly ApplicationDbContext _context;

        public EnergyDataRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<EnergyData>> GetAllAsync()
        {
            return await _context.EnergyData
                .Include(e => e.GridArea)
                .OrderByDescending(e => e.Timestamp)
                .ToListAsync();
        }

        public async Task<EnergyData?> GetByIdAsync(int id)
        {
            return await _context.EnergyData
                .Include(e => e.GridArea)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<EnergyData> CreateAsync(EnergyData entity)
        {
            _context.EnergyData.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<EnergyData> UpdateAsync(EnergyData entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.EnergyData.FindAsync(id);
            if (entity == null) return false;

            _context.EnergyData.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.EnergyData.AnyAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<EnergyData>> GetByGridAreaAsync(int gridAreaId)
        {
            return await _context.EnergyData
                .Include(e => e.GridArea)
                .Where(e => e.GridAreaId == gridAreaId)
                .OrderByDescending(e => e.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<EnergyData>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.EnergyData
                .Include(e => e.GridArea)
                .Where(e => e.Timestamp >= startDate && e.Timestamp <= endDate)
                .OrderByDescending(e => e.Timestamp)
                .ToListAsync();
        }

        public async Task<IEnumerable<EnergyData>> GetByGridAreaAndDateRangeAsync(int gridAreaId, DateTime startDate, DateTime endDate)
        {
            return await _context.EnergyData
                .Include(e => e.GridArea)
                .Where(e => e.GridAreaId == gridAreaId && e.Timestamp >= startDate && e.Timestamp <= endDate)
                .OrderByDescending(e => e.Timestamp)
                .ToListAsync();
        }
    }
}