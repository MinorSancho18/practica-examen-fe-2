// AJAX Helper with centralized error handling
const AjaxHelper = {
    // Show loading state on button
    setButtonLoading: function(button, loading) {
        const $btn = $(button);
        if (loading) {
            $btn.prop('disabled', true);
            $btn.data('original-text', $btn.html());
            $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...');
        } else {
            $btn.prop('disabled', false);
            $btn.html($btn.data('original-text'));
        }
    },

    // Parse validation errors from API
    parseValidationErrors: function(errors) {
        if (!errors) return 'Error de validación';
        
        let messages = [];
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                messages.push(errors[field].join(', '));
            }
        }
        return messages.join('<br>');
    },

    // Handle API errors
    handleError: function(xhr, customMessage) {
        let errorMessage = customMessage || 'Ha ocurrido un error';
        
        if (xhr.status === 400) {
            // Bad Request - Validation errors
            if (xhr.responseJSON && xhr.responseJSON.errors) {
                errorMessage = this.parseValidationErrors(xhr.responseJSON.errors);
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else {
                errorMessage = 'Datos inválidos. Por favor revise el formulario.';
            }
        } else if (xhr.status === 401) {
            errorMessage = 'No autorizado. Por favor inicie sesión.';
        } else if (xhr.status === 403) {
            errorMessage = 'No tiene permisos para realizar esta acción.';
        } else if (xhr.status === 404) {
            errorMessage = 'Recurso no encontrado.';
        } else if (xhr.status === 409) {
            // Conflict
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else {
                errorMessage = 'Conflicto al procesar la solicitud.';
            }
        } else if (xhr.status === 500) {
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else {
                errorMessage = 'Error del servidor. Por favor intente más tarde.';
            }
        } else if (xhr.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión.';
        }

        return errorMessage;
    },

    // Show success message
    showSuccess: function(message, callback) {
        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
        }).then((result) => {
            if (callback && typeof callback === 'function') {
                callback(result);
            }
        });
    },

    // Show error message
    showError: function(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            html: message,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
    },

    // Show confirmation dialog
    showConfirmation: function(title, text, callback) {
        Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed && callback && typeof callback === 'function') {
                callback();
            }
        });
    },

    // Generic AJAX request
    request: function(options) {
        const self = this;
        const button = options.button;
        
        if (button) {
            this.setButtonLoading(button, true);
        }

        return $.ajax({
            url: options.url,
            type: options.type || 'GET',
            data: options.data ? JSON.stringify(options.data) : null,
            contentType: options.contentType || 'application/json',
            dataType: options.dataType || 'json'
        })
        .done(function(response) {
            if (options.successCallback && typeof options.successCallback === 'function') {
                options.successCallback(response);
            }
        })
        .fail(function(xhr) {
            const errorMessage = self.handleError(xhr, options.errorMessage);
            if (options.errorCallback && typeof options.errorCallback === 'function') {
                options.errorCallback(errorMessage, xhr);
            } else {
                self.showError(errorMessage);
            }
        })
        .always(function() {
            if (button) {
                self.setButtonLoading(button, false);
            }
        });
    }
};
