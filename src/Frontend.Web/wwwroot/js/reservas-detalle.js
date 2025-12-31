let table;
let habitacionesDisponibles = [];

$(document).ready(function () {
    loadHabitacionesDisponibles();
    initDataTable();
    bindEvents();
});

function loadHabitacionesDisponibles() {
    $.get('/Reservas/GetHabitacionesDisponibles', function (data) {
        habitacionesDisponibles = data;
        populateHabitacionesDropdown();
    });
}

function populateHabitacionesDropdown() {
    const select = $('#habitacionSelect');
    select.empty();
    select.append('<option value="">Seleccione...</option>');
    habitacionesDisponibles.forEach(hab => {
        select.append(`<option value="${hab.idHabitacion}">${hab.codigo} - ${hab.nombre} (${hab.tipoHabitacion?.nombre || 'N/A'}) - ₡${hab.tarifa.toFixed(2)}</option>`);
    });
}

function initDataTable() {
    table = $('#tblHabitaciones').DataTable({
        ajax: {
            url: '/Reservas/GetHabitaciones',
            data: { idReserva: idReserva },
            dataSrc: 'data'
        },
        columns: [
            { data: 'idReservaHabitacion' },
            { 
                data: 'habitacion',
                render: function(data) {
                    return data ? data.codigo : 'N/A';
                }
            },
            { 
                data: 'habitacion',
                render: function(data) {
                    return data ? data.nombre : 'N/A';
                }
            },
            { 
                data: 'habitacion',
                render: function(data) {
                    return data && data.tipoHabitacion ? data.tipoHabitacion.nombre : 'N/A';
                }
            },
            { data: 'noches' },
            { 
                data: 'subtotal',
                render: function(data) {
                    return '₡' + parseFloat(data).toFixed(2);
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-danger btn-remove" data-id="${row.idHabitacion}">
                            <i class="bi bi-trash"></i> Quitar
                        </button>
                    `;
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        responsive: true,
        drawCallback: function() {
            updateTotal();
        }
    });
}

function bindEvents() {
    $('#btnAgregarHabitacion').click(function () {
        loadHabitacionesDisponibles();
        $('#modalAgregarHabitacion').modal('show');
    });

    $('#btnConfirmarAgregar').click(function () {
        agregarHabitacion();
    });

    $('#tblHabitaciones').on('click', '.btn-remove', function () {
        const idHabitacion = $(this).data('id');
        removerHabitacion(idHabitacion);
    });
}

function agregarHabitacion() {
    const idHabitacion = parseInt($('#habitacionSelect').val());
    
    if (!idHabitacion) {
        AjaxHelper.showError('Debe seleccionar una habitación');
        return;
    }

    AjaxHelper.request({
        url: '/Reservas/AddHabitacion',
        type: 'POST',
        data: { idReserva: idReserva, idHabitacion: idHabitacion },
        contentType: 'application/x-www-form-urlencoded',
        button: '#btnConfirmarAgregar',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Habitación agregada exitosamente', function () {
                $('#modalAgregarHabitacion').modal('hide');
                table.ajax.reload();
                loadHabitacionesDisponibles();
            });
        }
    });
}

function removerHabitacion(idHabitacion) {
    AjaxHelper.showConfirmation(
        '¿Quitar habitación?',
        'Esta acción no se puede deshacer',
        function () {
            AjaxHelper.request({
                url: '/Reservas/RemoveHabitacion',
                type: 'DELETE',
                data: { idReserva: idReserva, idHabitacion: idHabitacion },
                contentType: 'application/x-www-form-urlencoded',
                successCallback: function (response) {
                    AjaxHelper.showSuccess('Habitación removida exitosamente', function () {
                        table.ajax.reload();
                        loadHabitacionesDisponibles();
                    });
                }
            });
        }
    );
}

function updateTotal() {
    // Calculate total from table data
    let total = 0;
    table.rows().every(function () {
        const data = this.data();
        if (data && data.subtotal) {
            total += parseFloat(data.subtotal);
        }
    });
    
    $('#totalReserva').text('₡' + total.toFixed(2));
}
