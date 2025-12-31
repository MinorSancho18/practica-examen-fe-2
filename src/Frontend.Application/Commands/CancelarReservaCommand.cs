namespace Frontend.Application.Commands;

public class CancelarReservaCommand
{
    public int IdReserva { get; set; }
    public string MotivoCancelacion { get; set; } = string.Empty;
}
