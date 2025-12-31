using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Frontend.Domain.Entities;
using System.Net.Http.Json;

namespace Frontend.Infrastructure.Services;

public class HuespedService : IHuespedService
{
    private readonly HttpClient _httpClient;

    public HuespedService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<Huesped>> GetAllAsync()
    {
        var response = await _httpClient.GetFromJsonAsync<IEnumerable<Huesped>>("/api/huespedes");
        return response ?? new List<Huesped>();
    }

    public async Task<Huesped?> GetByIdAsync(int id)
    {
        return await _httpClient.GetFromJsonAsync<Huesped>($"/api/huespedes/{id}");
    }

    public async Task<Huesped> CreateAsync(CrearHuespedCommand command)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/huespedes", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Huesped>() ?? throw new Exception("Error creating huesped");
    }

    public async Task<Huesped> UpdateAsync(ActualizarHuespedCommand command)
    {
        var response = await _httpClient.PutAsJsonAsync($"/api/huespedes/{command.IdHuesped}", command);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<Huesped>() ?? throw new Exception("Error updating huesped");
    }

    public async Task DeleteAsync(int id)
    {
        var response = await _httpClient.DeleteAsync($"/api/huespedes/{id}");
        response.EnsureSuccessStatusCode();
    }
}
