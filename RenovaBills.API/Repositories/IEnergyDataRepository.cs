// Repositories/IEnergyDataRepository.cs
using RenovaBills.API.Models;

namespace RenovaBills.API.Repositories
{
    public interface IEnergyDataRepository : IRepository<EnergyData>
    {
        Task<IEnumerable<EnergyData>> GetByGridAreaAsync(int gridAreaId);
        Task<IEnumerable<EnergyData>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<EnergyData>> GetByGridAreaAndDateRangeAsync(int gridAreaId, DateTime startDate, DateTime endDate);
    }
}