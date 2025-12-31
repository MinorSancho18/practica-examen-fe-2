let table;
let huespedes = [];
let estadosReserva = [];

$(document).ready(function () {
    loadHuespedes();
    loadEstadosReserva();
    initDataTable();
    bindEvents();
});

function loadHuespedes() {
    $.get('/Reservas/GetHuespedes', function (data) {
        huespedes = data;
        populateHuespedesDropdowns();
    });
}

function loadEstadosReserva() {
    $.get('/Reservas/GetEstadosReserva', function (data) {
        estadosReserva = data;
        populateEstadosDropdowns();
    });
}

function populateHuespedesDropdowns() {
    const selects = ['#idHuesped', '#filtroHuesped'];
    selects.forEach(selector => {
        const select = $(selector);
        const currentValue = select.val();
        select.empty();
        select.append('<option value="">Seleccione...</option>');
        huespedes.forEach(huesped => {
            select.append(`<option value="${huesped.idHuesped}">${huesped.nombre}</option>`);
        });
        if (currentValue) {
            select.val(currentValue);
        }
    });
}

function populateEstadosDropdowns() {
    const selects = ['#idEstadoReserva', '#filtroEstado', '#nuevoEstado'];
    selects.forEach(selector => {
        const select = $(selector);
        const currentValue = select.val();
        select.empty();
        if (selector === '#filtroEstado') {
            select.append('<option value="">Todos</option>');
        } else {
            select.append('<option value="">Seleccione...</option>');
        }
        estadosReserva.forEach(estado => {
            select.append(`<option value="${estado.idEstadoReserva}">${estado.nombre}</option>`);
        });
        if (currentValue) {
            select.val(currentValue);
        }
    });
}

function initDataTable() {
    table = $('#tblReservas').DataTable({
        ajax: {
            url: '/Reservas/Buscar',
            dataSrc: 'data'
        },
        columns: [
            { data: 'idReserva' },
            { 
                data: 'huesped',
                render: function(data) {
                    return data ? data.nombre : 'N/A';
                }
            },
            { 
                data: 'fechaDesde',
                render: function(data) {
                    return new Date(data).toLocaleString('es-CR');
                }
            },
            { 
                data: 'fechaHasta',
                render: function(data) {
                    return new Date(data).toLocaleString('es-CR');
                }
            },
            { 
                data: 'estadoReserva',
                render: function(data) {
                    return data ? `<span class="badge bg-info">${data.nombre}</span>` : 'N/A';
                }
            },
            { data: 'cantidadPersonas' },
            { 
                data: 'total',
                render: function(data) {
                    return '₡' + parseFloat(data).toFixed(2);
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <a href="/Reservas/Detalle/${row.idReserva}" class="btn btn-sm btn-info">
                            <i class="bi bi-eye"></i> Detalle
                        </a>
                        <button class="btn btn-sm btn-warning btn-edit" data-id="${row.idReserva}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-primary btn-estado" data-id="${row.idReserva}">
                            <i class="bi bi-arrow-repeat"></i> Estado
                        </button>
                        <button class="btn btn-sm btn-danger btn-cancelar" data-id="${row.idReserva}">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${row.idReserva}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        order: [[0, 'desc']]
    });
}

function bindEvents() {
    $('#btnNuevo').click(function () {
        openCreateModal();
    });

    $('#btnGuardar').click(function () {
        saveReserva();
    });

    $('#btnBuscar').click(function () {
        buscarReservas();
    });

    $('#btnLimpiar').click(function () {
        $('#filtroFechaDesde').val('');
        $('#filtroFechaHasta').val('');
        $('#filtroEstado').val('');
        $('#filtroHuesped').val('');
        buscarReservas();
    });

    $('#tblReservas').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        editReserva(id);
    });

    $('#tblReservas').on('click', '.btn-estado', function () {
        const id = $(this).data('id');
        openCambiarEstadoModal(id);
    });

    $('#tblReservas').on('click', '.btn-cancelar', function () {
        const id = $(this).data('id');
        openCancelarModal(id);
    });

    $('#tblReservas').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteReserva(id);
    });

    $('#btnGuardarEstado').click(function () {
        cambiarEstado();
    });

    $('#btnConfirmarCancelar').click(function () {
        cancelarReserva();
    });
}

function buscarReservas() {
    const fechaDesde = $('#filtroFechaDesde').val();
    const fechaHasta = $('#filtroFechaHasta').val();
    const idEstadoReserva = $('#filtroEstado').val();
    const idHuesped = $('#filtroHuesped').val();

    const params = [];
    if (fechaDesde) params.push(`fechaDesde=${fechaDesde}`);
    if (fechaHasta) params.push(`fechaHasta=${fechaHasta}`);
    if (idEstadoReserva) params.push(`idEstadoReserva=${idEstadoReserva}`);
    if (idHuesped) params.push(`idHuesped=${idHuesped}`);

    const url = '/Reservas/Buscar' + (params.length > 0 ? '?' + params.join('&') : '');
    table.ajax.url(url).load();
}

function openCreateModal() {
    $('#modalReservaLabel').text('Nueva Reserva');
    $('#formReserva')[0].reset();
    $('#idReserva').val('');
    populateHuespedesDropdowns();
    populateEstadosDropdowns();
    $('#modalReserva').modal('show');
}

function editReserva(id) {
    $.get('/Reservas/GetById', { id: id }, function (data) {
        $('#modalReservaLabel').text('Editar Reserva');
        $('#idReserva').val(data.idReserva);
        $('#idHuesped').val(data.idHuesped);
        $('#fechaDesde').val(formatDateTimeLocal(data.fechaDesde));
        $('#fechaHasta').val(formatDateTimeLocal(data.fechaHasta));
        $('#cantidadPersonas').val(data.cantidadPersonas);
        $('#idEstadoReserva').val(data.idEstadoReserva);
        $('#modalReserva').modal('show');
    }).fail(function (xhr) {
        AjaxHelper.showError(AjaxHelper.handleError(xhr));
    });
}

function formatDateTimeLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function saveReserva() {
    const fechaDesde = new Date($('#fechaDesde').val());
    const fechaHasta = new Date($('#fechaHasta').val());

    if (fechaHasta <= fechaDesde) {
        AjaxHelper.showError('La fecha de check-out debe ser posterior a la fecha de check-in');
        return;
    }

    const id = $('#idReserva').val();
    const isEdit = id !== '';
    
    const data = {
        idHuesped: parseInt($('#idHuesped').val()),
        fechaDesde: $('#fechaDesde').val(),
        fechaHasta: $('#fechaHasta').val(),
        cantidadPersonas: parseInt($('#cantidadPersonas').val()),
        idEstadoReserva: parseInt($('#idEstadoReserva').val())
    };

    if (isEdit) {
        data.idReserva = parseInt(id);
    }

    const url = isEdit ? '/Reservas/Update' : '/Reservas/Create';
    const method = isEdit ? 'PUT' : 'POST';

    AjaxHelper.request({
        url: url,
        type: method,
        data: data,
        button: '#btnGuardar',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Reserva guardada exitosamente', function () {
                $('#modalReserva').modal('hide');
                table.ajax.reload();
            });
        }
    });
}

function openCambiarEstadoModal(id) {
    $('#idReservaCambiarEstado').val(id);
    populateEstadosDropdowns();
    $('#modalCambiarEstado').modal('show');
}

function cambiarEstado() {
    const data = {
        idReserva: parseInt($('#idReservaCambiarEstado').val()),
        idEstadoReserva: parseInt($('#nuevoEstado').val())
    };

    AjaxHelper.request({
        url: '/Reservas/UpdateEstado',
        type: 'PATCH',
        data: data,
        button: '#btnGuardarEstado',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Estado actualizado exitosamente', function () {
                $('#modalCambiarEstado').modal('hide');
                table.ajax.reload();
            });
        }
    });
}

function openCancelarModal(id) {
    $('#idReservaCancelar').val(id);
    $('#motivoCancelacion').val('');
    $('#modalCancelar').modal('show');
}

function cancelarReserva() {
    const motivo = $('#motivoCancelacion').val().trim();
    if (!motivo) {
        AjaxHelper.showError('Debe proporcionar un motivo de cancelación');
        return;
    }

    const data = {
        idReserva: parseInt($('#idReservaCancelar').val()),
        motivoCancelacion: motivo
    };

    AjaxHelper.request({
        url: '/Reservas/Cancelar',
        type: 'PATCH',
        data: data,
        button: '#btnConfirmarCancelar',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Reserva cancelada exitosamente', function () {
                $('#modalCancelar').modal('hide');
                table.ajax.reload();
            });
        }
    });
}

function deleteReserva(id) {
    AjaxHelper.showConfirmation(
        '¿Eliminar reserva?',
        'Esta acción no se puede deshacer',
        function () {
            AjaxHelper.request({
                url: '/Reservas/Delete',
                type: 'DELETE',
                data: { id: id },
                contentType: 'application/x-www-form-urlencoded',
                successCallback: function (response) {
                    AjaxHelper.showSuccess('Reserva eliminada exitosamente', function () {
                        table.ajax.reload();
                    });
                }
            });
        }
    );
}
