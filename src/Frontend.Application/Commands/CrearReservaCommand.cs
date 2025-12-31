namespace Frontend.Application.Commands;

public class CrearReservaCommand
{
    public int IdHuesped { get; set; }
    public DateTime FechaDesde { get; set; }
    public DateTime FechaHasta { get; set; }
    public int CantidadPersonas { get; set; }
    public int IdEstadoReserva { get; set; }
}
