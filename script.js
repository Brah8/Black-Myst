
const productos = [
    { id: 1, nombre: "Bicycle Red Premium", imagen: "./assets/img/image1.jpg", precio: 1500 },
    { id: 2, nombre: "Multiplicador de Bolas", imagen: "./assets/img/image2.jpg", precio: 1200 },
    { id: 3, nombre: "Bicycle Standar Roja-Azul", imagen: "./assets/img/image3.webp", precio: 1100 },
    { id: 4, nombre: "Caja de Magia", imagen: "./assets/img/image4.jpg", precio: 2000 },
    { id: 5, nombre: "Baraja Cambio de Color", imagen: "./assets/img/image5.jpg", precio: 1800 },
    { id: 6, nombre: "Magia con Naipes y Monedas", imagen: "./assets/img/image6.webp", precio: 1600 }
];



function filtrarProductos(event) {
    const texto = event.target.value.toLowerCase(); 
    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(texto)
    );
    renderProductos(productosFiltrados); 
}


const buscador = document.getElementById("buscador");
buscador.addEventListener("input", filtrarProductos);



const productosContainer = document.querySelector(".productos-container");


async function fetchProductos() {
    try {
        const response = await fetch("./productos.json"); 
        const productos = await response.json(); 
        renderProductos(productos); 
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}


function renderProductos(productos) {
    productosContainer.innerHTML = ""; 
    productos.forEach((producto) => {
        const productoCard = document.createElement("div");
        productoCard.classList.add("producto-card");
        productoCard.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Comprar</button>
        `;
        productosContainer.appendChild(productoCard);
    });
}


fetchProductos();




let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


function actualizarCarrito() {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
}


function mostrarCarrito() {
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = "";
    carrito.forEach((prod) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        item.innerHTML = `
            ${prod.nombre} - $${prod.precio} x ${prod.cantidad}
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
        `;
        carritoItems.appendChild(item);
    });
    const carritoModal = new bootstrap.Modal(document.getElementById("carritoModal"));
    carritoModal.show();
}

function agregarAlCarrito(id) {
    const producto = productos.find((prod) => prod.id === id);
    const productoEnCarrito = carrito.find((prod) => prod.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();

   
    mostrarToastBootstrap(`"${producto.nombre}" agregado con éxito al carrito`);
}


function vaciarCarrito() {
    carrito = []; 
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarCarrito(); 

  
    actualizarContenidoModal();

   
    limpiarBackdropYScroll();
}

function eliminarProducto(id) {

    carrito = carrito.filter((prod) => prod.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito)); 
    actualizarCarrito(); 

    
    actualizarContenidoModal();

    
    limpiarBackdropYScroll();
}



function cerrarModalConLimpieza() {
    
    const carritoModal = bootstrap.Modal.getInstance(document.getElementById("carritoModal"));
    if (carritoModal) {
        carritoModal.hide();
    }

    
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());

    
    document.body.classList.remove("modal-open");

    
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
}


function actualizarContenidoModal() {
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = ""; 
    carrito.forEach((prod) => {
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        item.innerHTML = `
            ${prod.nombre} - $${prod.precio} x ${prod.cantidad}
            <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${prod.id})">Eliminar</button>
        `;
        carritoItems.appendChild(item);
    });

    
    if (carrito.length === 0) {
        carritoItems.innerHTML = `<li class="list-group-item text-center">El carrito está vacío.</li>`;
    }
}


function limpiarBackdropYScroll() {
    
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
}


document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito(); 
});


window.addEventListener("scroll", () => {
    const irArriba = document.getElementById("ir-arriba");
    if (window.scrollY > 200) { 
        irArriba.style.display = "block";
    } else {
        irArriba.style.display = "none"; 
    }
});


document.getElementById("ir-arriba").addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});


//Toast
function mostrarToastBootstrap(mensaje) {
    
    const toastBody = document.querySelector("#liveToast .toast-body");
    toastBody.textContent = mensaje;

    
    const toast = new bootstrap.Toast(document.getElementById("liveToast"));
    toast.show();
}


