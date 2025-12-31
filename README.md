# Sistema de Reservas de Hotel - Frontend .NET 8 MVC

Sistema de gestión de reservas de hotel desarrollado con ASP.NET Core MVC 8.0 utilizando Clean Architecture.

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado en 4 capas siguiendo los principios de Clean Architecture:

```
/src
  ├── Frontend.Domain           # Capa de dominio (Entidades, Common)
  ├── Frontend.Application       # Capa de aplicación (DTOs, Commands, Interfaces)
  ├── Frontend.Infrastructure    # Capa de infraestructura (Services, Configuration)
  └── Frontend.Web              # Capa de presentación (MVC)
```

### Dependencias entre Capas

- **Frontend.Web** → Frontend.Application, Frontend.Infrastructure
- **Frontend.Infrastructure** → Frontend.Application, Frontend.Domain
- **Frontend.Application** → Frontend.Domain
- **Frontend.Domain** → ninguno (sin dependencias)

## 🚀 Tecnologías Utilizadas

- **.NET 8.0** - Framework principal
- **ASP.NET Core MVC** - Framework web
- **HttpClient** - Consumo de API REST
- **jQuery 3.7.1** - Manipulación del DOM y AJAX
- **Bootstrap 5.3.2** - Framework CSS
- **DataTables.net 1.13.7** - Tablas interactivas
- **SweetAlert2 11.10.0** - Alertas y confirmaciones

## 📋 Requisitos Previos

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Editor de código (Visual Studio 2022, VS Code, Rider)
- API Backend ejecutándose en `https://localhost:7001`

## ⚙️ Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MinorSancho18/practica-examen-fe-2.git
cd practica-examen-fe-2
```

### 2. Configurar API Settings

Editar `src/Frontend.Web/appsettings.json`:

```json
{
  "ApiSettings": {
    "BaseUrl": "https://localhost:7001",
    "Timeout": 30
  }
}
```

### 3. Restaurar Dependencias

```bash
dotnet restore
```

### 4. Compilar el Proyecto

```bash
dotnet build
```

### 5. Ejecutar la Aplicación

```bash
cd src/Frontend.Web
dotnet run
```

La aplicación estará disponible en:
- HTTPS: `https://localhost:7002`
- HTTP: `http://localhost:5002`

## 📁 Estructura Detallada

### Frontend.Domain

Contiene las entidades del dominio:

- `EstadoReserva` - Estados de las reservas
- `TipoHabitacion` - Tipos de habitaciones
- `Habitacion` - Habitaciones del hotel
- `Huesped` - Información de huéspedes
- `Reserva` - Reservas (Maestro)
- `ReservaHabitacion` - Relación reserva-habitación (Detalle)

### Frontend.Application

#### Commands (DTOs)
- `CrearHabitacionCommand`, `ActualizarHabitacionCommand`
- `CrearHuespedCommand`, `ActualizarHuespedCommand`
- `CrearReservaCommand`, `ActualizarReservaCommand`
- `ActualizarEstadoReservaCommand`, `CancelarReservaCommand`

#### Interfaces
Contratos de servicios para cada entidad del dominio.

### Frontend.Infrastructure

#### Services
Implementaciones de servicios que consumen la API REST:
- `EstadoReservaService`
- `TipoHabitacionService`
- `HabitacionService`
- `HuespedService`
- `ReservaService`
- `ReservaHabitacionService`

#### Configuration
- `ApiSettings` - Configuración de la API

### Frontend.Web

#### Controllers
- `HabitacionesController` - CRUD de habitaciones
- `HuespedesController` - CRUD de huéspedes
- `ReservasController` - CRUD de reservas + Maestro-Detalle

#### Views
- `Habitaciones/Index.cshtml` - Gestión de habitaciones
- `Huespedes/Index.cshtml` - Gestión de huéspedes
- `Reservas/Index.cshtml` - Listado y filtros de reservas
- `Reservas/Detalle.cshtml` - Detalle de reserva con habitaciones

#### JavaScript
- `ajax-helper.js` - Manejo centralizado de AJAX y errores
- `habitaciones.js` - Lógica de habitaciones
- `huespedes.js` - Lógica de huéspedes
- `reservas.js` - Lógica de reservas
- `reservas-detalle.js` - Lógica maestro-detalle

## 🎯 Funcionalidades

### 1. Gestión de Habitaciones

- ✅ Listar habitaciones con DataTable
- ✅ Crear nueva habitación
- ✅ Editar habitación existente
- ✅ Ver detalles de habitación
- ✅ Eliminar habitación
- ✅ Filtrar por tipo de habitación

### 2. Gestión de Huéspedes

- ✅ Listar huéspedes con DataTable
- ✅ Crear nuevo huésped
- ✅ Editar huésped existente
- ✅ Ver detalles de huésped
- ✅ Eliminar huésped
- ✅ Validaciones (email, teléfono, edad 18+, tarjeta)

### 3. Gestión de Reservas (Maestro-Detalle)

#### Maestro (Reserva)
- ✅ Crear reserva con validaciones de fechas
- ✅ Editar reserva
- ✅ Cambiar estado de reserva
- ✅ Cancelar reserva con motivo
- ✅ Eliminar reserva
- ✅ Buscar reservas por filtros (fechas, estado, huésped)

#### Detalle (Habitaciones)
- ✅ Ver habitaciones asignadas a una reserva
- ✅ Agregar habitaciones a la reserva
- ✅ Remover habitaciones de la reserva
- ✅ Calcular total automáticamente
- ✅ Validaciones de reglas de negocio

## 🔌 Endpoints del API Consumidos

### Estados de Reserva
- `GET /api/estados-reserva`
- `GET /api/estados-reserva/{id}`

### Tipos de Habitación
- `GET /api/tipos-habitacion`
- `GET /api/tipos-habitacion/{id}`

### Habitaciones
- `GET /api/habitaciones`
- `GET /api/habitaciones/{id}`
- `POST /api/habitaciones`
- `PUT /api/habitaciones/{id}`
- `DELETE /api/habitaciones/{id}`

### Huéspedes
- `GET /api/huespedes`
- `GET /api/huespedes/{id}`
- `POST /api/huespedes`
- `PUT /api/huespedes/{id}`
- `DELETE /api/huespedes/{id}`

### Reservas
- `GET /api/reservas/{id}`
- `POST /api/reservas`
- `PUT /api/reservas/{id}`
- `DELETE /api/reservas/{id}`
- `PATCH /api/reservas/{id}/estado`
- `PATCH /api/reservas/{id}/cancelar`
- `GET /api/reservas/buscar?fechaDesde=&fechaHasta=&idEstadoReserva=&idHuesped=`

### Reserva-Habitación
- `GET /api/reservas/{idReserva}/habitaciones`
- `POST /api/reservas/{idReserva}/habitaciones/{idHabitacion}`
- `DELETE /api/reservas/{idReserva}/habitaciones/{idHabitacion}`

## 🛡️ Manejo de Errores

El sistema incluye manejo centralizado de errores en `ajax-helper.js`:

- **400 Bad Request** - Validaciones
- **401 Unauthorized** - No autorizado
- **403 Forbidden** - Sin permisos
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Conflicto
- **500 Internal Server Error** - Error del servidor

Todos los errores se muestran usando SweetAlert2 con mensajes amigables.

## 📝 Reglas de Negocio Implementadas

1. ✅ Fecha Check-out debe ser posterior a Check-in
2. ✅ Validar disponibilidad antes de confirmar
3. ✅ No permitir confirmar reservas sin habitaciones
4. ✅ Calcular total automáticamente
5. ✅ Realizar Check-in solo con reserva confirmada
6. ✅ Realizar Check-out solo con saldo cero
7. ✅ Bloquear cambios si reserva está Cancelada/Check-in/Check-out
8. ✅ Edad mínima de 18 años para huéspedes
9. ✅ Validación de tarjeta de crédito (16 dígitos)
10. ✅ Validación de teléfono (8 dígitos)

## 🎨 Interfaz de Usuario

- **Diseño responsivo** con Bootstrap 5
- **Tablas interactivas** con DataTables (búsqueda, ordenamiento, paginación)
- **Modales** para todas las operaciones CRUD
- **Alertas** con SweetAlert2
- **Navegación intuitiva** entre módulos

## 🧪 Testing

Para probar la aplicación:

1. Asegurarse de que la API backend esté ejecutándose
2. Iniciar la aplicación frontend
3. Navegar a cada módulo y probar las operaciones CRUD
4. Probar el flujo maestro-detalle en Reservas

## 🚨 Solución de Problemas

### Error de conexión con la API

**Problema:** No se puede conectar con el servidor backend.

**Solución:** 
1. Verificar que la API esté ejecutándose en `https://localhost:7001`
2. Verificar la configuración en `appsettings.json`
3. Verificar el certificado SSL

### Error de CORS

**Problema:** Errores de CORS en el navegador.

**Solución:** Asegurarse de que el backend tenga configurado CORS para permitir el origen del frontend.

### DataTables no se cargan

**Problema:** Las tablas no muestran datos.

**Solución:** 
1. Verificar la consola del navegador para errores JavaScript
2. Verificar que los endpoints del API estén respondiendo correctamente
3. Verificar la configuración de HttpClient en `Program.cs`

## 📦 Compilación para Producción

```bash
dotnet publish -c Release -o ./publish
```

Los archivos compilados estarán en la carpeta `./publish`.

## 👥 Contribución

Este es un proyecto académico. Para contribuir:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es parte de una práctica académica.

## ✅ Checklist de Entregables

- ✅ Solución .NET 8 con Clean Architecture (4 proyectos)
- ✅ CRUD completo para Habitaciones, Huéspedes, Reservas
- ✅ Maestro-Detalle funcional (Reservas ↔ Habitaciones)
- ✅ DataTables en todas las grillas
- ✅ Modales Bootstrap para todas las operaciones
- ✅ AJAX helper centralizado con manejo robusto de errores
- ✅ Validaciones de reglas de negocio
- ✅ README.md completo con instrucciones
- ✅ .gitignore para .NET
- ✅ Código compilable sin errores

## 📞 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ usando .NET 8 y Clean Architecture**
