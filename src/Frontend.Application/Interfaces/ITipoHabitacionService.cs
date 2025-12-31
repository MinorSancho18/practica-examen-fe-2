using Frontend.Application.Commands;
using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface ITipoHabitacionService
{
    Task<IEnumerable<TipoHabitacion>> GetAllAsync();
    Task<TipoHabitacion?> GetByIdAsync(int id);
}
