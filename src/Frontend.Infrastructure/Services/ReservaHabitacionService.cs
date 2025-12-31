using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class ReservaHabitacionService : IReservaHabitacionService
{
    private readonly HttpClient _httpClient;

    public ReservaHabitacionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<ReservaHabitacion>> GetByReservaIdAsync(int idReserva)
    {
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<ReservaHabitacion>>($"/api/reservas/{idReserva}/habitaciones");
        return response ?? new List<ReservaHabitacion>();
    }

    public async Task<ReservaHabitacion> AddHabitacionAsync(int idReserva, int idHabitacion)
    {
        var response = await _httpClient.PostAsync($"/api/reservas/{idReserva}/habitaciones/{idHabitacion}", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ReservaHabitacion>() ?? throw new Exception("Error adding habitacion");
    }

    public async Task DeleteHabitacionAsync(int idReserva, int idHabitacion)
    {
        var response = await _httpClient.DeleteAsync($"/api/reservas/{idReserva}/habitaciones/{idHabitacion}");
        response.EnsureSuccessStatusCode();
    }
}
