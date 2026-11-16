const inputNombre = document.getElementById("input-nombre");
const inputPrecio = document.getElementById("input-precio");
const inputStock = document.getElementById("input-stock");
const btnAgregar = document.getElementById("btn-agregar");
const inputBusqueda = document.getElementById("input-busqueda");
const btnVaciar = document.getElementById("btn-vaciar");



function actualizarVista() {
    const textoFiltro = inputBusqueda.value.toLowerCase().trim();
    const productosFiltrados = productosJS.filter((producto) => producto.nombre.toLowerCase().includes(textoFiltro)
    );
    renderizarProductos(productosFiltrados);
}


/* --- Inicio de app --- */

async function iniciarApp() {
    try {
        await inicializarProductos();
        actualizarVista();
        mostrarToast("📦 Productos iniciales cargados con éxito", "#28a745");
    } catch (error) {
        mostrarErrorGlobal(error);
    }
}

iniciarApp();

setTimeout(() => {
    mostrarToast("🔔 Sistema de inventario cargado correctamente. Datos sincronizados.", "#17a2b8");
}, 3000);

btnAgregar.addEventListener("click", () => {
    try {
        const nombre = inputNombre.value.trim();
        const precio = parseFloat(inputPrecio.value);
        const stock = parseInt(inputStock.value);

        if (nombre === "" || isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
            throw new Error("Por favor, ingrese un nombre, un precio válido y la cantidad");
        }

        const nuevoId = productosJS.length > 0 ? Math.max(...productosJS.map(p => p.id)) + 1 : 1;
        const nuevoProducto = { id: nuevoId, nombre, precio, stock };

        productosJS.push(nuevoProducto);

        guardarLocalStorage();
        actualizarVista();
        mostrarToast(`✅ ${nombre} agregado con éxito`);

    } catch (error) {
        mostrarToast(`⚠️ ${error.message}`, "#dc3545");
    } finally {
        inputNombre.value = "";
        inputPrecio.value = "";
        inputStock.value = "";
    }
});

/* --- Busqueda --- */

inputBusqueda.addEventListener("keyup", (e) => {
    actualizarVista();
});

/* --- Eliminar / Editar --- */

contenedorProductos.addEventListener("click", (e) => {
    //  Eliminar
    if (e.target?.classList.contains("btn-eliminar")) {
        const idAEliminar = parseInt(e.target.getAttribute("data-id"));

        if (isNaN(idAEliminar)) {
            mostrarToast("⚠️ No se pudo identificar el producto a eliminar.", "#dc3545");
            return;
        }

        confirmarEliminacion(() => {
            const indice = productosJS.findIndex(p => p.id === idAEliminar);
            if (indice !== -1) {
                productosJS.splice(indice, 1);
                guardarLocalStorage();
                actualizarVista();
                mostrarToast("🗑️ Producto eliminado con éxito", "#ffc107");
            }
        });
    }

// Editar
if (e.target?.classList.contains("btn-editar")) {
    const idAEditar = parseInt(e.target.getAttribute("data-id"));
    const producto = productosJS.find(p => p.id === idAEditar);
    if (!producto) {
        mostrarToast("⚠️ Producto no encontrado para editar.", "#dc3545");
        return;
    }
    
    confirmarEdicion(producto, (nuevoPrecio) => {
            producto.precio = nuevoPrecio;
            guardarLocalStorage();
            actualizarVista();
            mostrarToast(`✏️ Precio de "${producto.nombre}" actualizado a $${nuevoPrecio}.`);
        });
    }
});

/* --- Vaciar --- */

btnVaciar.addEventListener("click", () => {
    try {
        if (productosJS.length === 0) {
            throw new Error("El inventario ya se encuentra vacío.");
        }

        confirmarVaciado(() => {
            productosJS.length = 0;
            guardarLocalStorage();
            actualizarVista();
            mostrarToast("🧹 Se vació todo el inventario correctamente.", "#17a2b8");
        });
    } catch (error) {
        mostrarToast(`⚠️ ${error.message}`, "#dc3545");
    }
});

