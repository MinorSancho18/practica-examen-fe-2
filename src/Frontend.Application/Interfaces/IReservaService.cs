using Frontend.Application.Commands;
using Frontend.Domain.Entities;

namespace Frontend.Application.Interfaces;

public interface IReservaService
{
    Task<Reserva?> GetByIdAsync(int id);
    Task<Reserva> CreateAsync(CrearReservaCommand command);
    Task<Reserva> UpdateAsync(ActualizarReservaCommand command);
    Task DeleteAsync(int id);
    Task<Reserva> UpdateEstadoAsync(ActualizarEstadoReservaCommand command);
    Task<Reserva> CancelarAsync(CancelarReservaCommand command);
    Task<IEnumerable<Reserva>> BuscarAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? idEstadoReserva, int? idHuesped);
}
