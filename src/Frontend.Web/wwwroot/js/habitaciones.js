let table;
let tiposHabitacion = [];

$(document).ready(function () {
    loadTiposHabitacion();
    initDataTable();
    bindEvents();
});

function loadTiposHabitacion() {
    $.get('/Habitaciones/GetTiposHabitacion', function (data) {
        tiposHabitacion = data;
        populateTiposDropdown();
    });
}

function populateTiposDropdown() {
    const select = $('#idTipoHabitacion');
    select.empty();
    select.append('<option value="">Seleccione...</option>');
    tiposHabitacion.forEach(tipo => {
        select.append(`<option value="${tipo.idTipoHabitacion}">${tipo.nombre}</option>`);
    });
}

function initDataTable() {
    table = $('#tblHabitaciones').DataTable({
        ajax: {
            url: '/Habitaciones/GetAll',
            dataSrc: 'data'
        },
        columns: [
            { data: 'idHabitacion' },
            { data: 'codigo' },
            { data: 'nombre' },
            { 
                data: 'tipoHabitacion',
                render: function(data) {
                    return data ? data.nombre : 'N/A';
                }
            },
            { 
                data: 'tarifa',
                render: function(data) {
                    return '₡' + parseFloat(data).toFixed(2);
                }
            },
            { data: 'maxPersonas' },
            { 
                data: 'activa',
                render: function(data) {
                    return data ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-danger">No</span>';
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info btn-view" data-id="${row.idHabitacion}">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        <button class="btn btn-sm btn-warning btn-edit" data-id="${row.idHabitacion}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${row.idHabitacion}">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true
    });
}

function bindEvents() {
    $('#btnNuevo').click(function () {
        openCreateModal();
    });

    $('#btnGuardar').click(function () {
        saveHabitacion();
    });

    $('#tblHabitaciones').on('click', '.btn-view', function () {
        const id = $(this).data('id');
        viewHabitacion(id);
    });

    $('#tblHabitaciones').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        editHabitacion(id);
    });

    $('#tblHabitaciones').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteHabitacion(id);
    });
}

function openCreateModal() {
    $('#modalHabitacionLabel').text('Nueva Habitación');
    $('#formHabitacion')[0].reset();
    $('#idHabitacion').val('');
    $('#activa').prop('checked', true);
    populateTiposDropdown();
    $('#modalHabitacion').modal('show');
}

function viewHabitacion(id) {
    $.get('/Habitaciones/GetById', { id: id }, function (data) {
        $('#viewId').text(data.idHabitacion);
        $('#viewCodigo').text(data.codigo);
        $('#viewNombre').text(data.nombre);
        $('#viewTipo').text(data.tipoHabitacion ? data.tipoHabitacion.nombre : 'N/A');
        $('#viewTarifa').text('₡' + parseFloat(data.tarifa).toFixed(2));
        $('#viewMaxPersonas').text(data.maxPersonas);
        $('#viewActiva').html(data.activa ? '<span class="badge bg-success">Sí</span>' : '<span class="badge bg-danger">No</span>');
        $('#modalViewHabitacion').modal('show');
    }).fail(function (xhr) {
        AjaxHelper.showError(AjaxHelper.handleError(xhr));
    });
}

function editHabitacion(id) {
    $.get('/Habitaciones/GetById', { id: id }, function (data) {
        $('#modalHabitacionLabel').text('Editar Habitación');
        $('#idHabitacion').val(data.idHabitacion);
        $('#codigo').val(data.codigo);
        $('#nombre').val(data.nombre);
        $('#idTipoHabitacion').val(data.idTipoHabitacion);
        $('#tarifa').val(data.tarifa);
        $('#maxPersonas').val(data.maxPersonas);
        $('#activa').prop('checked', data.activa);
        $('#modalHabitacion').modal('show');
    }).fail(function (xhr) {
        AjaxHelper.showError(AjaxHelper.handleError(xhr));
    });
}

function saveHabitacion() {
    const id = $('#idHabitacion').val();
    const isEdit = id !== '';
    
    const data = {
        codigo: $('#codigo').val(),
        nombre: $('#nombre').val(),
        idTipoHabitacion: parseInt($('#idTipoHabitacion').val()),
        tarifa: parseFloat($('#tarifa').val()),
        maxPersonas: parseInt($('#maxPersonas').val()),
        activa: $('#activa').is(':checked')
    };

    if (isEdit) {
        data.idHabitacion = parseInt(id);
    }

    const url = isEdit ? '/Habitaciones/Update' : '/Habitaciones/Create';
    const method = isEdit ? 'PUT' : 'POST';

    AjaxHelper.request({
        url: url,
        type: method,
        data: data,
        button: '#btnGuardar',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Habitación guardada exitosamente', function () {
                $('#modalHabitacion').modal('hide');
                table.ajax.reload();
            });
        }
    });
}

function deleteHabitacion(id) {
    AjaxHelper.showConfirmation(
        '¿Eliminar habitación?',
        'Esta acción no se puede deshacer',
        function () {
            AjaxHelper.request({
                url: '/Habitaciones/Delete',
                type: 'DELETE',
                data: { id: id },
                contentType: 'application/x-www-form-urlencoded',
                successCallback: function (response) {
                    AjaxHelper.showSuccess('Habitación eliminada exitosamente', function () {
                        table.ajax.reload();
                    });
                }
            });
        }
    );
}
