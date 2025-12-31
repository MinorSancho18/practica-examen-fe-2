using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class EstadoReservaService : IEstadoReservaService
{
    private readonly HttpClient _httpClient;

    public EstadoReservaService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<EstadoReserva>> GetAllAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<EstadoReserva>>("/api/estados-reserva");
        return response ?? new List<EstadoReserva>();
    }

    public async Task<EstadoReserva?> GetByIdAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<EstadoReserva>($"/api/estados-reserva/{id}");
    }
}
