using Frontend.Application.Commands;
using Frontend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.Web.Controllers;

public class ReservasController : Controller
{
    private readonly IReservaService _reservaService;
    private readonly IReservaHabitacionService _reservaHabitacionService;
    private readonly IHuespedService _huespedService;
    private readonly IEstadoReservaService _estadoReservaService;
    private readonly IHabitacionService _habitacionService;

    public ReservasController(
        IReservaService reservaService,
        IReservaHabitacionService reservaHabitacionService,
        IHuespedService huespedService,
        IEstadoReservaService estadoReservaService,
        IHabitacionService habitacionService)
    {
        _reservaService = reservaService;
        _reservaHabitacionService = reservaHabitacionService;
        _huespedService = huespedService;
        _estadoReservaService = estadoReservaService;
        _habitacionService = habitacionService;
    }

    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> Detalle(int id)
    {
        try
        {
            var reserva = await _reservaService.GetByIdAsync(id);
            if (reserva == null)
                return NotFound();

            return View(reserva);
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
            return RedirectToAction(nameof(Index));
        }
    }

    [HttpGet]
    public async Task<IActionResult> Buscar(DateTime? fechaDesde, DateTime? fechaHasta, int? idEstadoReserva, int? idHuesped)
    {
        try
        {
            var reservas = await _reservaService.BuscarAsync(fechaDesde, fechaHasta, idEstadoReserva, idHuesped);
            return Json(new { data = reservas });
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
            var reserva = await _reservaService.GetByIdAsync(id);
            if (reserva == null)
                return NotFound();
            
            return Json(reserva);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetHuespedes()
    {
        try
        {
            var huespedes = await _huespedService.GetAllAsync();
            return Json(huespedes);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetEstadosReserva()
    {
        try
        {
            var estados = await _estadoReservaService.GetAllAsync();
            return Json(estados);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CrearReservaCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reserva = await _reservaService.CreateAsync(command);
            return Ok(reserva);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ActualizarReservaCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reserva = await _reservaService.UpdateAsync(command);
            return Ok(reserva);
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
            await _reservaService.DeleteAsync(id);
            return Ok(new { message = "Reserva eliminada exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateEstado([FromBody] ActualizarEstadoReservaCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reserva = await _reservaService.UpdateEstadoAsync(command);
            return Ok(reserva);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPatch]
    public async Task<IActionResult> Cancelar([FromBody] CancelarReservaCommand command)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var reserva = await _reservaService.CancelarAsync(command);
            return Ok(reserva);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    // Maestro-Detalle: ReservaHabitacion endpoints
    [HttpGet]
    public async Task<IActionResult> GetHabitaciones(int idReserva)
    {
        try
        {
            var habitaciones = await _reservaHabitacionService.GetByReservaIdAsync(idReserva);
            return Json(new { data = habitaciones });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetHabitacionesDisponibles()
    {
        try
        {
            var habitaciones = await _habitacionService.GetAllAsync();
            return Json(habitaciones.Where(h => h.Activa));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddHabitacion(int idReserva, int idHabitacion)
    {
        try
        {
            var reservaHabitacion = await _reservaHabitacionService.AddHabitacionAsync(idReserva, idHabitacion);
            return Ok(reservaHabitacion);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveHabitacion(int idReserva, int idHabitacion)
    {
        try
        {
            await _reservaHabitacionService.DeleteHabitacionAsync(idReserva, idHabitacion);
            return Ok(new { message = "Habitación removida exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
