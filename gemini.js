document.addEventListener('DOMContentLoaded', () => {
    const tablaPrecios = document.getElementById('comparativaPrecios'); // Asegúrate de que este ID coincida con tu tabla
    if (!tablaPrecios) {
        console.error('La tabla con el ID "comparativaPrecios" no fue encontrada.');
        return;
    }

    // Obtenemos los nombres de los proveedores de los inputs en el thead
    const encabezadosProveedor = tablaPrecios.querySelectorAll('thead th input[type="text"]');
    const nombresProveedores = [];
    encabezadosProveedor.forEach(input => {
        if (input.placeholder && input.placeholder.startsWith('Proveedor')) {
            nombresProveedores.push(input.placeholder);
        }
    });

    /**
     * Función para procesar una fila y resaltar el precio más bajo,
     * y actualizar las columnas de "Precio más Bajo" y "Proveedor".
     * @param {HTMLElement} fila La fila (tr) de la tabla a procesar.
     */
    function procesarFila(fila) {
        const inputsPrecio = fila.querySelectorAll('td input[type="number"]');
        let precioMasBajo = Infinity;
        let celdaMasBaja = null;
        let indiceProveedorMasBajo = -1;

        // Limpiar estilos previos y valores de las columnas de resultado
        inputsPrecio.forEach(input => {
            input.style.color = ''; // Elimina el color rojo
            input.style.fontWeight = ''; // Elimina el negrita
        });

        // Borrar contenido de las celdas de resultado
        const celdasResultado = fila.querySelectorAll('td:last-child, td:nth-last-child(2)');
        if (celdasResultado[0]) celdasResultado[0].textContent = '';
        if (celdasResultado[1]) celdasResultado[1].textContent = '';


        inputsPrecio.forEach((input, index) => {
            const precio = parseFloat(input.value);

            // Solo consideramos precios válidos y no vacíos
            if (!isNaN(precio) && input.value !== '') {
                if (precio < precioMasBajo) {
                    precioMasBajo = precio;
                    celdaMasBaja = input; // Guardamos la referencia al input
                    indiceProveedorMasBajo = index;
                }
            }
        });

        // Aplicar estilo al precio más bajo y rellenar las celdas de resultado
        if (celdaMasBaja !== null) {
            celdaMasBaja.style.color = 'red';
            celdaMasBaja.style.fontWeight = 'bold';

            // Actualizar la celda "Precio más Bajo"
            const celdaResultadoPrecio = fila.querySelector('td:nth-last-child(2)');
            if (celdaResultadoPrecio) {
                celdaResultadoPrecio.textContent = `$${precioMasBajo.toFixed(2)}`; // Formatear a moneda si es necesario
            }

            // Actualizar la celda "Proveedor"
            const celdaResultadoProveedor = fila.querySelector('td:last-child');
            if (celdaResultadoProveedor && nombresProveedores[indiceProveedorMasBajo]) {
                celdaResultadoProveedor.textContent = nombresProveedores[indiceProveedorMasBajo];
            }
        }
    }

    // Seleccionar todas las filas del tbody
    const filasCuerpo = tablaPrecios.querySelectorAll('tbody tr');

    // Asignar el evento 'input' a cada campo de precio
    filasCuerpo.forEach(fila => {
        const inputsPrecio = fila.querySelectorAll('td input[type="number"]');
        inputsPrecio.forEach(input => {
            input.addEventListener('input', () => procesarFila(fila));
        });
        // También procesar la fila inicialmente por si ya hay valores precargados
        procesarFila(fila);
    });

    // Opcional: Si quieres que los nombres de los proveedores se actualicen si el usuario los cambia
    encabezadosProveedor.forEach(input => {
        input.addEventListener('input', () => {
            // Volver a cargar los nombres de los proveedores
            nombresProveedores.length = 0; // Vaciar el array existente
            encabezadosProveedor.forEach(headerInput => {
                if (headerInput.placeholder && headerInput.placeholder.startsWith('Proveedor')) {
                    nombresProveedores.push(headerInput.value || headerInput.placeholder); // Usa el valor si está escrito, si no, el placeholder
                }
            });
            // Recorrer todas las filas para re-evaluar y actualizar el proveedor
            filasCuerpo.forEach(fila => procesarFila(fila));
        });
    });
});