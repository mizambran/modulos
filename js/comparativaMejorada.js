document.addEventListener('DOMContentLoaded', () => {
    const tablaPrecios = document.getElementById('comparativaPrecios');
    const tbodyPrecios = document.getElementById('tbodyPrecios'); // Nuevo: Referencia al tbody
    const addProductoBtn = document.getElementById('addProductoBtn'); // Nuevo: Botón para añadir
    
    if (!tablaPrecios || !tbodyPrecios || !addProductoBtn) {
        console.error('Uno o más elementos esenciales (tabla, tbody, o botón de añadir) no fueron encontrados.');
        return;
    }

    // Obtenemos los nombres de los proveedores de los inputs en el thead
    const encabezadosProveedorInputs = tablaPrecios.querySelectorAll('thead th input[type="text"]');
    let nombresProveedores = []; // Usamos 'let' para poder reasignar el array

    function actualizarNombresProveedores() {
        nombresProveedores = []; // Vaciamos el array
        encabezadosProveedorInputs.forEach(input => {
            // Usamos el valor actual del input, o el placeholder si el valor está vacío
            const nombre = input.value.trim() !== '' ? input.value.trim() : input.placeholder;
            if (nombre && nombre.startsWith('Proveedor')) { // Asegurarse de que sea un campo de proveedor
                nombresProveedores.push(nombre);
            }
        });
        // Si los nombres de los proveedores cambian, re-evaluamos todas las filas
        // Esto es importante para actualizar las columnas "PROVEEDOR" si un nombre cambia
        tbodyPrecios.querySelectorAll('tr').forEach(fila => procesarFila(fila));
    }

    // Llamar al inicio para cargar los nombres de los proveedores
    actualizarNombresProveedores();

    /**
     * Función para procesar una fila y resaltar el precio más bajo,
     * y actualizar las columnas de "Precio más Bajo" y "Proveedor".
     * @param {HTMLElement} fila La fila (tr) de la tabla a procesar.
     */
    function procesarFila(fila) {
        const inputsPrecio = fila.querySelectorAll('td input[type="number"]');
        let precioMasBajo = Infinity;
        let celdaMasBajaInput = null;
        let indiceProveedorMasBajo = -1;

        // Limpiar estilos previos y valores de las columnas de resultado
        inputsPrecio.forEach(input => {
            input.style.color = '';
            input.style.fontWeight = '';
        });

        const celdasResultado = fila.querySelectorAll('td:nth-last-child(2), td:nth-last-child(3)'); // Selecciona las dos últimas celdas TD
        const celdaResultadoPrecio = celdasResultado[0]; // La penúltima (Precio)
        const celdaResultadoProveedor = celdasResultado[1]; // La última (Proveedor)

        if (celdaResultadoPrecio) celdaResultadoPrecio.textContent = '';
        if (celdaResultadoProveedor) celdaResultadoProveedor.textContent = '';


        inputsPrecio.forEach((input, index) => {
            const precio = parseFloat(input.value);

            // Solo consideramos precios válidos y no vacíos
            if (!isNaN(precio) && input.value !== '') {
                if (precio < precioMasBajo) {
                    precioMasBajo = precio;
                    celdaMasBajaInput = input; // Guardamos la referencia al input
                    indiceProveedorMasBajo = index;
                }
            }
        });

        // Aplicar estilo al precio más bajo y rellenar las celdas de resultado
        if (celdaMasBajaInput !== null) {
            celdaMasBajaInput.style.color = 'red';
            celdaMasBajaInput.style.fontWeight = 'bold';

            if (celdaResultadoPrecio) {
                celdaResultadoPrecio.textContent = `$${precioMasBajo.toFixed(2)}`; // Formatear a moneda
            }

            if (celdaResultadoProveedor && nombresProveedores[indiceProveedorMasBajo]) {
                celdaResultadoProveedor.textContent = nombresProveedores[indiceProveedorMasBajo];
            }
        }
    }

    /**
     * Función para añadir listeners a los inputs de una fila.
     * Esto es útil para las filas nuevas.
     */
    function configurarListenersFila(fila) {
        const inputsPrecio = fila.querySelectorAll('td input[type="number"]');
        inputsPrecio.forEach(input => {
            input.addEventListener('input', () => procesarFila(fila));
        });

        const deleteButton = fila.querySelector('.delete-row-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                fila.remove(); // Elimina la fila del DOM
            });
        }
    }

    // Configurar listeners para las filas existentes al cargar la página
    tbodyPrecios.querySelectorAll('tr').forEach(fila => {
        configurarListenersFila(fila);
        procesarFila(fila); // Procesar fila inicial
    });

    // Event listener para el botón "Añadir Producto"
    addProductoBtn.addEventListener('click', () => {
        const nuevaFila = document.createElement('tr');
        const numFilasActuales = tbodyPrecios.querySelectorAll('tr').length;
        const productoPlaceholder = `Producto ${numFilasActuales + 1}`;

        // Construir el HTML para la nueva fila
        nuevaFila.innerHTML = `
            <th><input type="text" placeholder="${productoPlaceholder}"></th>
            <td><input type="number" placeholder="Precio"></td>
            <td><input type="number" placeholder="Precio"></td>
            <td><input type="number" placeholder="Precio"></td>
            <td><input type="number" placeholder="Precio"></td>
            <td></td>
            <td></td>
            <td><button class="btn btn-danger btn-sm delete-row-btn">Eliminar</button></td>
        `;
        tbodyPrecios.appendChild(nuevaFila); // Añadir la nueva fila al tbody

        // Configurar los listeners para los inputs de la nueva fila
        configurarListenersFila(nuevaFila);
    });

    // Opcional: Si quieres que los nombres de los proveedores se actualicen si el usuario los cambia
    encabezadosProveedorInputs.forEach(input => {
        input.addEventListener('input', actualizarNombresProveedores);
    });
});