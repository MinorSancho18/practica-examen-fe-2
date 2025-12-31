using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Web.Controllers;

public class HabitacionesController : Controller
{
    private readonly IHabitacionService _habitacionService;
    private readonly ITipoHabitacionService _tipoHabitacionService;

    public HabitacionesController(IHabitacionService habitacionService, ITipoHabitacionService tipoHabitacionService)
    {
        _habitacionService = habitacionService;
        _tipoHabitacionService = tipoHabitacionService;
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
            var habitaciones = await _habitacionService.GetAllAsync();
            return Json(new { data = habitaciones });
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
            var habitacion = await _habitacionService.GetByIdAsync(id);
            if (habitacion == null)
                return NotFound();
            
            return Json(habitacion);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetTiposHabitacion()
    {
        try
        {
            var tipos = await _tipoHabitacionService.GetAllAsync();
            return Json(tipos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearHabitacionCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var habitacion = await _habitacionService.CreateAsync(command);
            return Ok(habitacion);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ActualizarHabitacionCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var habitacion = await _habitacionService.UpdateAsync(command);
            return Ok(habitacion);
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
            await _habitacionService.DeleteAsync(id);
            return Ok(new { message = "Habitación eliminada exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
