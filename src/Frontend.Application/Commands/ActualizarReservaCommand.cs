namespace Frontend.Application.Commands;

public class ActualizarReservaCommand
{
    public int IdReserva { get; set; }
    public int IdHuesped { get; set; }
    public DateTime FechaDesde { get; set; }
    public DateTime FechaHasta { get; set; }
    public int IdEstadoReserva { get; set; }
    public int CantidadPersonas { get; set; }
}
