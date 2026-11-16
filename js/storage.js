let productosJS = [];

async function inicializarProductos() {
    const productosGuardados = localStorage.getItem("productosJS");
    if (productosGuardados) {
        productosJS = JSON.parse(productosGuardados);
        return;
    }

    try {
        const response = await fetch("./data/data.json");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        productosJS = data;
        guardarLocalStorage();
    } catch (error) {
        throw error;
    } finally {
        console.log("Proceso de inicialización de productos finalizado.");
    }
}

function guardarLocalStorage() {
    localStorage.setItem("productosJS", JSON.stringify(productosJS));
}