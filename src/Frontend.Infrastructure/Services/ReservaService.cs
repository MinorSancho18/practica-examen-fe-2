using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class ReservaService : IReservaService
{
    private readonly HttpClient _httpClient;

    public ReservaService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<Reserva?> GetByIdAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<Reserva>($"/api/reservas/{id}");
    }

    public async Task<Reserva> CreateAsync(CrearReservaCommand command)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/reservas", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Reserva>() ?? throw new Exception("Error creating reserva");
    }

    public async Task<Reserva> UpdateAsync(ActualizarReservaCommand command)
    {
        var response = await _httpClient.PutAsJsonAsync($"/api/reservas/{command.IdReserva}", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Reserva>() ?? throw new Exception("Error updating reserva");
    }

    public async Task DeleteAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"/api/reservas/{id}");
        response.EnsureSuccessStatusCode();
    }

    public async Task<Reserva> UpdateEstadoAsync(ActualizarEstadoReservaCommand command)
    {
        var response = await _httpClient.PatchAsJsonAsync($"/api/reservas/{command.IdReserva}/estado", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Reserva>() ?? throw new Exception("Error updating estado");
    }

    public async Task<Reserva> CancelarAsync(CancelarReservaCommand command)
    {
        var response = await _httpClient.PatchAsJsonAsync($"/api/reservas/{command.IdReserva}/cancelar", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Reserva>() ?? throw new Exception("Error canceling reserva");
    }

    public async Task<IEnumerable<Reserva>> BuscarAsync(DateTime? fechaDesde, DateTime? fechaHasta, int? idEstadoReserva, int? idHuesped)
    {
        var queryParams = new List<string>();
        
        if (fechaDesde.HasValue)
            queryParams.Add($"fechaDesde={fechaDesde.Value:yyyy-MM-ddTHH:mm:ss}");
        
        if (fechaHasta.HasValue)
            queryParams.Add($"fechaHasta={fechaHasta.Value:yyyy-MM-ddTHH:mm:ss}");
        
        if (idEstadoReserva.HasValue)
            queryParams.Add($"idEstadoReserva={idEstadoReserva.Value}");
        
        if (idHuesped.HasValue)
            queryParams.Add($"idHuesped={idHuesped.Value}");

        var queryString = queryParams.Count > 0 ? "?" + string.Join("&", queryParams) : "";
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<Reserva>>($"/api/reservas/buscar{queryString}");
        return response ?? new List<Reserva>();
    }
}
