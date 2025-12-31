using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class TipoHabitacionService : ITipoHabitacionService
{
    private readonly HttpClient _httpClient;

    public TipoHabitacionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<TipoHabitacion>> GetAllAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<TipoHabitacion>>("/api/tipos-habitacion");
        return response ?? new List<TipoHabitacion>();
    }

    public async Task<TipoHabitacion?> GetByIdAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<TipoHabitacion>($"/api/tipos-habitacion/{id}");
    }
}
