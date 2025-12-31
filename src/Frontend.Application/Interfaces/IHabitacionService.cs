using Frontend.Application.Commands;
using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface IHabitacionService
{
    Task<IEnumerable<Habitacion>> GetAllAsync();
    Task<Habitacion?> GetByIdAsync(int id);
    Task<Habitacion> CreateAsync(CrearHabitacionCommand command);
    Task<Habitacion> UpdateAsync(ActualizarHabitacionCommand command);
    Task DeleteAsync(int id);
}
