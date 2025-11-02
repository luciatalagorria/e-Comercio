document.addEventListener("DOMContentLoaded", () => {
  const containerCarrito = document.getElementById("containerCarrito");
  const carrVacio = document.getElementById("carrVacio");
  const tituloCarrito = document.getElementById("tituloCarrito");

  const carritoGuardado = localStorage.getItem("carrito");

  const formatUYU = (number) => {
    return new Intl.NumberFormat('es-UY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
};

  //  Tasa de conversión ejemplo (USD → UYU)
  const tasaUSDaUYU = 40; 

  // Función para calcular el total general en UYU
  function calcularTotal(carrito, tasa) {
  const totalNumerico = carrito.reduce((acc, prod) => {
    const subtotal =
      prod.currency === "USD"
        ? prod.price * prod.quantity * tasa
        : prod.price * prod.quantity;
    return acc + subtotal;
  }, 0);
  
  // ⬇ Aplicar el formato
  return formatUYU(totalNumerico); 
}

  // Comprobar si el carrito está vacío
  if (!carritoGuardado || carritoGuardado === "[]") {
    tituloCarrito.classList.add("d-none");
    carrVacio.classList.remove("d-none");
    containerCarrito.classList.add("d-none");
    return;
  }

  const carrito = JSON.parse(carritoGuardado);

  if (carrito.length === 0 || carrito === "[]") {
    carrVacio.classList.remove("d-none");
    tituloCarrito.classList.add("d-none"); 
    containerCarrito.classList.add("d-none");
    return;
  }

  // --- GENERACIÓN DEL HTML (Estructura de Tarjeta con Botones) ---
  let html = `
    <div id="productos-en-carrito">
  `;

  carrito.forEach((prod, i) => {
    
    const subtotalNumerico =
      prod.currency === "USD"
        ? prod.price * prod.quantity * tasaUSDaUYU
        : prod.price * prod.quantity;

    html += `
      <div class="producto-card" data-index="${i}">
        <div class="producto-principal">
          <div class="info-texto">
            <span class="nombre-producto">${prod.name}</span>
          </div>
          <img src="${prod.image}" class="card-img-producto" alt="${prod.name}">
        </div>

        <div class="producto-detalles">
          <div class="detalle-item">
            <span class="detalle-etiqueta">Precio unitario</span>
            <span class="detalle-valor">${prod.currency} ${prod.price}</span>
          </div>
          
          <div class="detalle-item cantidad-control">
            <span class="detalle-etiqueta">Cantidad</span>
            <div class="cantidad-input-group">
              <button class="btn btn-restar">-</button>
              <input type="number" min="1" value="${prod.quantity}" class="input-cantidad text-center">
              <button class="btn btn-sumar">+</button>
            </div>
          </div>

          <div class="detalle-item subtotal-container">
            <span class="subtotal-valor subtotal">UYU ${formatUYU(subtotalNumerico)}</span>
            <button class="btn btn-danger btn-eliminar">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
    </div> 
    <div class="total-container mt-4"> 
      <h4 id="total" class="fw-bold">TOTAL: ${calcularTotal(carrito, tasaUSDaUYU)} UYU</h4>
      <button class="btn btn-success ms-3">Finalizar compra</button>
    </div>
  `;

  containerCarrito.innerHTML = html;



  // Actualizacion: Cantidad, Subtotal y Total

  //  Función centralizada para actualizar la fila
  function actualizarFila(filaElement, index, nuevaCantidad) {
    const producto = carrito[index];
    
    // 1. Validar y ajustar la cantidad (mínimo 1)
    let cantidadAjustada = Math.max(1, parseInt(nuevaCantidad));
    
    // 2. Actualizar el input en el DOM
    const inputCantidad = filaElement.querySelector(".input-cantidad");
    inputCantidad.value = cantidadAjustada;

    // 3. Actualizar el array y localStorage (persistencia)
    producto.quantity = cantidadAjustada;
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // 4. Calcular y actualizar el subtotal
    const nuevoSubtotal =
        producto.currency === "USD"
          ? producto.price * cantidadAjustada * tasaUSDaUYU
          : producto.price * cantidadAjustada;

    //  Aplicar el formato al subtotal
    filaElement.querySelector(".subtotal").textContent = `UYU ${formatUYU(nuevoSubtotal)}`;

    // 5. Actualizar el total general
    document.getElementById("total").textContent = `TOTAL: ${calcularTotal(carrito, tasaUSDaUYU)} UYU`;
  }

  //  "Listeners" para inputs y botones
  document.querySelectorAll(".producto-card").forEach(fila => {
    const index = parseInt(fila.dataset.index);
    const inputCantidad = fila.querySelector(".input-cantidad");
    
    // Controlador de input (por si escriben la cantidad manualmente)
    inputCantidad.addEventListener("input", (e) => {
      // Usamos el valor del input directamente
      actualizarFila(fila, index, e.target.value);
    });
    
    // Manejador de botón quitar
    fila.querySelector(".btn-restar").addEventListener("click", () => {
      let cantidadActual = parseInt(inputCantidad.value);
      if (cantidadActual > 1) { // Prevenir cantidad menor a 1
        actualizarFila(fila, index, cantidadActual - 1);
      }
    });

    // Manejador de botón agregar
    fila.querySelector(".btn-sumar").addEventListener("click", () => {
      let cantidadActual = parseInt(inputCantidad.value);
      actualizarFila(fila, index, cantidadActual + 1);
    });
  });


  //  Eliminar productos del carrito
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", e => {
      const fila = e.target.closest(".producto-card"); 
      const index = fila.dataset.index;
      carrito.splice(index, 1);

      // Guardar y recargar vista
      localStorage.setItem("carrito", JSON.stringify(carrito));
      if (carrito.length === 0) {
        containerCarrito.innerHTML = "";
        tituloCarrito.classList.add("d-none");
        carrVacio.classList.remove("d-none");
      } else {
        location.reload(); 
      }
    });
  });
});