using Frontend.Application.Commands;
using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface IEstadoReservaService
{
    Task<IEnumerable<EstadoReserva>> GetAllAsync();
    Task<EstadoReserva?> GetByIdAsync(int id);
}
