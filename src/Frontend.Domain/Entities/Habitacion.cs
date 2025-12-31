namespace Frontend.Domain.Entities;

public class Habitacion
{
    public int IdHabitacion { get; set; }
    public int IdTipoHabitacion { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public decimal Tarifa { get; set; }
    public int MaxPersonas { get; set; }
    public bool Activa { get; set; }
    public TipoHabitacion? TipoHabitacion { get; set; }
}
