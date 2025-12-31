using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface IReservaHabitacionService
{
    Task<IEnumerable<ReservaHabitacion>> GetByReservaIdAsync(int idReserva);
    Task<ReservaHabitacion> AddHabitacionAsync(int idReserva, int idHabitacion);
    Task DeleteHabitacionAsync(int idReserva, int idHabitacion);
}
