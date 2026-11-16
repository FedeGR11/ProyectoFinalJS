const contenedorProductos = document.getElementById("contenedor-productos");

function renderizarProductos(lista) {
    contenedorProductos.innerHTML = "";

    lista.forEach(({ id, nombre, precio, stock }) => {
        contenedorProductos.innerHTML += `
            <div>
                <h3>${nombre}</h3>
                <span>ID:${id}</span>
                <p>Precio: $${precio}</p>
                <p><span class="texto-stock">Stock: ${stock ?? 0}</span></p>
                <button class="btn-editar" data-id="${id}">Editar precio</button>
                <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            </div>
         `;
    });
}

/*--- confirmacion SweetAlert --- */

function confirmarEliminacion(accionEliminar) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el producto del inventario.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) accionEliminar();
    });
}

function confirmarVaciado(accionVaciar) {
    Swal.fire({
        title: "¿Vaciar todo el inventario?",
        text: "Esta acción eliminará todos los productos registrados.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) accionVaciar();
    });
}

function confirmarEdicion(producto, guardarPrecio) {
    Swal.fire({
            title: `Editar precio de "${producto.nombre}"`,
            input: "number",
            inputValue: producto.precio,
            inputAttributes: {
                min: 0,
                step: "any"
            },
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            inputValidator: (value) => {
                const precioValido = parseFloat(value);
                if (!value || isNaN(precioValido) || precioValido <= 0) {
                    return "Por favor, ingrese un precio válido mayor a 0.";
                }
            }
        }).then((result) => {
            if (result.isConfirmed) guardarPrecio(parseFloat(result.value));
        });
}

/* --- Toastify --- */

function mostrarToast (mensaje, fondo = "#28a745") {
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: fondo }
    }).showToast();
}

function mostrarErrorGlobal(error) {
    Swal.fire({
        icon: "error",
        title: "Error al cargar los datos",
        text: `No se pudieron cargar los productos: ${error.message}`,
        confirmButtonColor: "#dc3545"
    });
}