using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class HabitacionService : IHabitacionService
{
    private readonly HttpClient _httpClient;

    public HabitacionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<Habitacion>> GetAllAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<Habitacion>>("/api/habitaciones");
        return response ?? new List<Habitacion>();
    }

    public async Task<Habitacion?> GetByIdAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<Habitacion>($"/api/habitaciones/{id}");
    }

    public async Task<Habitacion> CreateAsync(CrearHabitacionCommand command)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/habitaciones", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Habitacion>() ?? throw new Exception("Error creating habitacion");
    }

    public async Task<Habitacion> UpdateAsync(ActualizarHabitacionCommand command)
    {
        var response = await _httpClient.PutAsJsonAsync($"/api/habitaciones/{command.IdHabitacion}", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Habitacion>() ?? throw new Exception("Error updating habitacion");
    }

    public async Task DeleteAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"/api/habitaciones/{id}");
        response.EnsureSuccessStatusCode();
    }
}
