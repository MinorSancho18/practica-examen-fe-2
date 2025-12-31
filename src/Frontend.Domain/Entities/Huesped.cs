namespace Frontend.Domain.Entities;

public class Huesped
{
    public int IdHuesped { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public int Edad { get; set; }
    public string NumeroTarjetaCredito { get; set; } = string.Empty;
}
