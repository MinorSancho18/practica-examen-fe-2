namespace Frontend.Application.Commands;

public class CrearHabitacionCommand
{
    public int IdTipoHabitacion { get; set; }
    public decimal Tarifa { get; set; }
    public bool Activa { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public int MaxPersonas { get; set; }
}
