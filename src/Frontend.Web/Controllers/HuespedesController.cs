using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Web.Controllers;

public class HuespedesController : Controller
{
    private readonly IHuespedService _huespedService;

    public HuespedesController(IHuespedService huespedService)
    {
        _huespedService = huespedService;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var huespedes = await _huespedService.GetAllAsync();
            return Json(new { data = huespedes });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var huesped = await _huespedService.GetByIdAsync(id);
            if (huesped == null)
                return NotFound();
            
            return Json(huesped);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearHuespedCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var huesped = await _huespedService.CreateAsync(command);
            return Ok(huesped);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ActualizarHuespedCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var huesped = await _huespedService.UpdateAsync(command);
            return Ok(huesped);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _huespedService.DeleteAsync(id);
            return Ok(new { message = "Huésped eliminado exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
