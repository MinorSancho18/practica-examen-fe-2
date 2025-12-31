namespace Frontend.Domain.Entities;

public class Reserva
{
    public int IdReserva { get; set; }
    public int IdHuesped { get; set; }
    public DateTime FechaDesde { get; set; }
    public DateTime FechaHasta { get; set; }
    public int CantidadPersonas { get; set; }
    public int IdEstadoReserva { get; set; }
    public decimal Total { get; set; }
    public string? MotivoCancelacion { get; set; }
    public Huesped? Huesped { get; set; }
    public EstadoReserva? EstadoReserva { get; set; }
}
