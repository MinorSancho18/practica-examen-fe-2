let table;

$(document).ready(function () {
    initDataTable();
    bindEvents();
});

function initDataTable() {
    table = $('#tblHuespedes').DataTable({
        ajax: {
            url: '/Huespedes/GetAll',
            dataSrc: 'data'
        },
        columns: [
            { data: 'idHuesped' },
            { data: 'nombre' },
            { data: 'telefono' },
            { data: 'correo' },
            { data: 'edad' },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-info btn-view" data-id="${row.idHuesped}">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        <button class="btn btn-sm btn-warning btn-edit" data-id="${row.idHuesped}">
                            <i class="bi bi-pencil"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${row.idHuesped}">
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
        saveHuesped();
    });

    $('#tblHuespedes').on('click', '.btn-view', function () {
        const id = $(this).data('id');
        viewHuesped(id);
    });

    $('#tblHuespedes').on('click', '.btn-edit', function () {
        const id = $(this).data('id');
        editHuesped(id);
    });

    $('#tblHuespedes').on('click', '.btn-delete', function () {
        const id = $(this).data('id');
        deleteHuesped(id);
    });
}

function openCreateModal() {
    $('#modalHuespedLabel').text('Nuevo Huésped');
    $('#formHuesped')[0].reset();
    $('#idHuesped').val('');
    $('#modalHuesped').modal('show');
}

function viewHuesped(id) {
    $.get('/Huespedes/GetById', { id: id }, function (data) {
        $('#viewId').text(data.idHuesped);
        $('#viewNombre').text(data.nombre);
        $('#viewTelefono').text(data.telefono);
        $('#viewCorreo').text(data.correo);
        $('#viewEdad').text(data.edad);
        $('#viewTarjeta').text('**** **** **** ' + data.numeroTarjetaCredito.substr(-4));
        $('#modalViewHuesped').modal('show');
    }).fail(function (xhr) {
        AjaxHelper.showError(AjaxHelper.handleError(xhr));
    });
}

function editHuesped(id) {
    $.get('/Huespedes/GetById', { id: id }, function (data) {
        $('#modalHuespedLabel').text('Editar Huésped');
        $('#idHuesped').val(data.idHuesped);
        $('#nombre').val(data.nombre);
        $('#telefono').val(data.telefono);
        $('#correo').val(data.correo);
        $('#edad').val(data.edad);
        $('#numeroTarjetaCredito').val(data.numeroTarjetaCredito);
        $('#modalHuesped').modal('show');
    }).fail(function (xhr) {
        AjaxHelper.showError(AjaxHelper.handleError(xhr));
    });
}

function saveHuesped() {
    // Validaciones
    const edad = parseInt($('#edad').val());
    if (edad < 18) {
        AjaxHelper.showError('La edad mínima es 18 años');
        return;
    }

    const telefono = $('#telefono').val();
    if (telefono.length !== 8) {
        AjaxHelper.showError('El teléfono debe tener 8 dígitos');
        return;
    }

    const tarjeta = $('#numeroTarjetaCredito').val();
    if (tarjeta.length !== 16) {
        AjaxHelper.showError('La tarjeta de crédito debe tener 16 dígitos');
        return;
    }

    const id = $('#idHuesped').val();
    const isEdit = id !== '';
    
    const data = {
        nombre: $('#nombre').val(),
        telefono: telefono,
        correo: $('#correo').val(),
        edad: edad,
        numeroTarjetaCredito: tarjeta
    };

    if (isEdit) {
        data.idHuesped = parseInt(id);
    }

    const url = isEdit ? '/Huespedes/Update' : '/Huespedes/Create';
    const method = isEdit ? 'PUT' : 'POST';

    AjaxHelper.request({
        url: url,
        type: method,
        data: data,
        button: '#btnGuardar',
        successCallback: function (response) {
            AjaxHelper.showSuccess('Huésped guardado exitosamente', function () {
                $('#modalHuesped').modal('hide');
                table.ajax.reload();
            });
        }
    });
}

function deleteHuesped(id) {
    AjaxHelper.showConfirmation(
        '¿Eliminar huésped?',
        'Esta acción no se puede deshacer',
        function () {
            AjaxHelper.request({
                url: '/Huespedes/Delete',
                type: 'DELETE',
                data: { id: id },
                contentType: 'application/x-www-form-urlencoded',
                successCallback: function (response) {
                    AjaxHelper.showSuccess('Huésped eliminado exitosamente', function () {
                        table.ajax.reload();
                    });
                }
            });
        }
    );
}
