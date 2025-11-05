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
// --------------------------
// 🛒 CART.JS - ENTREGA 7
// --------------------------


document.addEventListener("DOMContentLoaded", () => {
    const subtotalElement = document.getElementById("subtotal");
    const costoEnvioElement = document.getElementById("costoEnvio");
    const totalElement = document.getElementById("total");
    const finalizarCompraBtn = document.getElementById("finalizarCompraBtn");
    const tipoEnvioRadios = document.querySelectorAll('input[name="tipoEnvio"]');
    const compraExitosaModal = new bootstrap.Modal(document.getElementById('compraExitosaModal'));


    // 🧮 Productos simulados (podés reemplazarlos por tu JSON o variables del proyecto)
    let productos = [
        { nombre: "Producto A", costo: 100, cantidad: 1 },
        { nombre: "Producto B", costo: 50, cantidad: 2 }
    ];


    // --------------------------
    // 🔹 Cálculo de costos
    // --------------------------
    function calcularSubtotal() {
        return productos.reduce((acc, p) => acc + (p.costo * p.cantidad), 0);
    }


    function calcularCostoEnvio(subtotal) {
        const envioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
        if (!envioSeleccionado) return 0;
        return subtotal * parseFloat(envioSeleccionado.value);
    }


    function actualizarCostos() {
        const subtotal = calcularSubtotal();
        const costoEnvio = calcularCostoEnvio(subtotal);
        const total = subtotal + costoEnvio;


        subtotalElement.textContent = subtotal.toFixed(2);
        costoEnvioElement.textContent = costoEnvio.toFixed(2);
        totalElement.textContent = total.toFixed(2);
    }


    tipoEnvioRadios.forEach(radio => {
        radio.addEventListener("change", actualizarCostos);
    });


    actualizarCostos();


    // --------------------------
    // ✅ Validaciones
    // --------------------------
    function validarCampos() {
        const departamento = document.getElementById("departamento").value.trim();
        const localidad = document.getElementById("localidad").value.trim();
        const calle = document.getElementById("calle").value.trim();
        const numero = document.getElementById("numero").value.trim();
        const esquina = document.getElementById("esquina").value.trim();


        // Dirección
        if (!departamento || !localidad || !calle || !numero || !esquina) {
            alert("⚠️ Complete todos los campos de dirección de envío.");
            return false;
        }


        // Tipo de envío
        const envioSeleccionado = document.querySelector('input[name="tipoEnvio"]:checked');
        if (!envioSeleccionado) {
            alert("⚠️ Debe seleccionar un tipo de envío.");
            return false;
        }


        // Cantidades
        for (let producto of productos) {
            if (!producto.cantidad || producto.cantidad <= 0) {
                alert(`⚠️ La cantidad del producto "${producto.nombre}" debe ser mayor a 0.`);
                return false;
            }
        }


        // Forma de pago
        const formaPagoSeleccionada = document.querySelector('input[name="formaPago"]:checked');
        if (!formaPagoSeleccionada) {
            alert("⚠️ Seleccione una forma de pago.");
            return false;
        }


        // Validación según forma de pago
        if (formaPagoSeleccionada.value === "tarjeta") {
            const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
            const vencimiento = document.getElementById("vencimiento").value.trim();
            const cvv = document.getElementById("cvv").value.trim();


            if (!numeroTarjeta || !vencimiento || !cvv) {
                alert("⚠️ Complete todos los campos de la tarjeta de crédito.");
                return false;
            }
            if (numeroTarjeta.length < 13 || numeroTarjeta.length > 16) {
                alert("⚠️ El número de tarjeta debe tener entre 13 y 16 dígitos.");
                return false;
            }
        }


        if (formaPagoSeleccionada.value === "transferencia") {
            const numeroCuenta = document.getElementById("numeroCuenta").value.trim();
            if (!numeroCuenta) {
                alert("⚠️ Ingrese un número de cuenta para la transferencia bancaria.");
                return false;
            }
        }


        return true;
    }


    // --------------------------
    // 💳 Evento Finalizar Compra
    // --------------------------
    finalizarCompraBtn.addEventListener("click", () => {
        if (validarCampos()) {
            compraExitosaModal.show();
        }
    });


    // --------------------------
    // 📦 (Opcional) Actualización dinámica de cantidades
    // --------------------------
    // Si tu HTML tiene inputs con clase .cantidad-producto, esto actualizará el subtotal en vivo.
    document.querySelectorAll(".cantidad-producto").forEach((input, index) => {
        input.addEventListener("input", () => {
            productos[index].cantidad = parseInt(input.value) || 0;
            actualizarCostos();
        });
    });
});

