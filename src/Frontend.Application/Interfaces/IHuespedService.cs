using Frontend.Application.Commands;
using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface IHuespedService
{
    Task<IEnumerable<Huesped>> GetAllAsync();
    Task<Huesped?> GetByIdAsync(int id);
    Task<Huesped> CreateAsync(CrearHuespedCommand command);
    Task<Huesped> UpdateAsync(ActualizarHuespedCommand command);
    Task DeleteAsync(int id);
}
