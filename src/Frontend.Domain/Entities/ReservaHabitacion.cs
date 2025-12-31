namespace Frontend.Domain.Entities;

public class ReservaHabitacion
{
    public int IdReservaHabitacion { get; set; }
    public int IdReserva { get; set; }
    public int IdHabitacion { get; set; }
    public int Noches { get; set; }
    public decimal Subtotal { get; set; }
    public Habitacion? Habitacion { get; set; }
}
