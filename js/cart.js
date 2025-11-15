/* document.addEventListener("DOMContentLoaded", () => {
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

// ABRIR MODAL
document.querySelector(".btn-success").addEventListener("click", () => {
  document.getElementById("modalCompra").classList.remove("d-none");

  document.getElementById("subtotalCompra").textContent = `${calcularTotal(carrito, tasaUSDaUYU)} UYU`;
});

// CERRAR MODAL
document.getElementById("btnCerrarModal").addEventListener("click", () => {
  document.getElementById("modalCompra").classList.add("d-none");
});

// CAMBIAR FORMA DE PAGO
document.querySelectorAll("input[name='pago']").forEach(p => {
  p.addEventListener("change", () => {
    document.getElementById("pago-tarjeta").classList.add("d-none");
    document.getElementById("pago-transferencia").classList.add("d-none");

    if (p.value === "tarjeta") {
      document.getElementById("pago-tarjeta").classList.remove("d-none");
    }

    if (p.value === "transferencia") {
      document.getElementById("pago-transferencia").classList.remove("d-none");
    }
  });
});

// CONFIRMAR COMPRA
document.getElementById("btnConfirmarCompra").addEventListener("click", () => {

  // VALIDACIONES
  const envio = document.querySelector("input[name='envio']:checked");
  const departamento = document.getElementById("departamento").value;
  const localidad = document.getElementById("localidad").value;
  const calle = document.getElementById("calle").value;
  const numero = document.getElementById("numero").value;
  const esquina = document.getElementById("esquina").value;
  const pago = document.querySelector("input[name='pago']:checked");

  if (!envio) return alert("Debe seleccionar un tipo de envío.");
  if (!departamento || !localidad || !calle || !numero || !esquina)
      return alert("Debe completar todos los datos de dirección.");
  if (!pago) return alert("Debe seleccionar una forma de pago.");

  // Validar campos de forma de pago
  if (pago.value === "tarjeta") {
    if (!document.getElementById("tarjeta-num").value ||
        !document.getElementById("tarjeta-nombre").value)
      return alert("Debe completar los datos de la tarjeta.");
  }

  if (pago.value === "transferencia") {
    if (!document.getElementById("cuenta-bancaria").value)
      return alert("Debe ingresar el número de cuenta bancaria.");
  }

  // VALIDAR CANTIDADES DEL CARRITO
  for (let producto of carrito) {
    if (!producto.quantity || producto.quantity <= 0)
      return alert("La cantidad de un producto es inválida.");
  }

  // SI TODO ESTÁ CORRECTO:
  alert("🎉 ¡Compra realizada con éxito!");

  // VACIAR CARRITO
  localStorage.removeItem("carrito");
  location.reload();
}); */

document.addEventListener("DOMContentLoaded", () => {
  // Referencias DOM
  const containerCarrito = document.getElementById("containerCarrito");
  const carrVacio = document.getElementById("carrVacio");
  const tituloCarrito = document.getElementById("tituloCarrito");
  const notifBadge = document.getElementById("notif-badge");

  // Modal y controles relacionados (deben existir en el HTML como te pasé antes)
  const modal = document.getElementById("modalCompra");
  const btnAbrirModal = document.getElementById("btnFinalizarCompra"); // debe existir en el HTML
  const btnCerrarModal = document.getElementById("btnCerrarModal");
  const btnConfirmarCompra = document.getElementById("btnConfirmarCompra");
  const subtotalCompraEl = document.getElementById("subtotalCompra");
  const costoEnvioEl = document.getElementById("costoEnvio");
  const totalFinalEl = document.getElementById("totalFinal");

  // Form fields (modal)
  const envioRadios = () => Array.from(document.querySelectorAll("input[name='envio']"));
  const pagoRadios = () => Array.from(document.querySelectorAll("input[name='pago']"));
  const departamentoEl = document.getElementById("departamento");
  const localidadEl = document.getElementById("localidad");
  const calleEl = document.getElementById("calle");
  const numeroEl = document.getElementById("numero");
  const esquinaEl = document.getElementById("esquina");
  const tarjetaNumEl = document.getElementById("tarjeta-num");
  const tarjetaNombreEl = document.getElementById("tarjeta-nombre");
  const cuentaBancariaEl = document.getElementById("cuenta-bancaria");

  // Formato moneda
  const formatUYU = (number) => {
    const n = Number(number) || 0;
    return new Intl.NumberFormat('es-UY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(n);
  };

  // tasa USD->UYU (si haces uso)
  const tasaUSDaUYU = 40;

  // Cargar carrito desde localStorage
  function obtenerCarrito() {
    try {
      const raw = localStorage.getItem("carrito");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Error parseando carrito:", e);
      return [];
    }
  }

  // Guardar carrito
  function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarNotifBadge(carrito);
  }

  // Actualizar notificación (badge)
  function actualizarNotifBadge(carrito) {
    if (!notifBadge) return;
    const totalCant = carrito.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
    notifBadge.textContent = totalCant;
  }

  // Calcular total en UYU (devuelve número)
  function calcularTotalNumerico(carrito) {
    return carrito.reduce((acc, prod) => {
      const price = Number(prod.price) || 0;
      const qty = Number(prod.quantity) || 0;
      const subtotal = prod.currency === "USD" ? price * qty * tasaUSDaUYU : price * qty;
      return acc + subtotal;
    }, 0);
  }

  // Calcular total y devolver texto formateado
  function calcularTotalFormat(carrito) {
    return formatUYU(calcularTotalNumerico(carrito));
  }

  // Render del carrito en pantalla
  function renderCarrito() {
    const carrito = obtenerCarrito();

    // casos vacíos
    if (!carrito || carrito.length === 0) {
      tituloCarrito.classList.add("d-none");
      carrVacio.classList.remove("d-none");
      containerCarrito.classList.add("d-none");
      actualizarNotifBadge([]);
      return;
    }

    tituloCarrito.classList.remove("d-none");
    carrVacio.classList.add("d-none");
    containerCarrito.classList.remove("d-none");

    // construir html
    let html = `<div id="productos-en-carrito">`;
    carrito.forEach((prod, i) => {
      const price = Number(prod.price) || 0;
      const qty = Number(prod.quantity) || 0;
      const subtotalNum = prod.currency === "USD" ? price * qty * tasaUSDaUYU : price * qty;

      html += `
        <div class="producto-card" data-index="${i}">
          <div class="producto-principal">
            <div class="info-texto">
              <span class="nombre-producto">${prod.name}</span>
            </div>
            <img src="${prod.image || 'img/no-image.png'}" class="card-img-producto" alt="${prod.name}">
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
                <input type="number" min="1" value="${qty}" class="input-cantidad text-center">
                <button class="btn btn-sumar">+</button>
              </div>
            </div>

            <div class="detalle-item subtotal-container">
              <span class="subtotal-valor subtotal">UYU ${formatUYU(subtotalNum)}</span>
              <button class="btn btn-eliminar">Eliminar</button>
            </div>
          </div>
        </div>
      `;
    });

    html += `</div>
      <div class="total-container mt-4">
        <h4 id="total" class="fw-bold">TOTAL: ${calcularTotalFormat(carrito)} UYU</h4>
        <button id="btnFinalizarCompra" class="btn btn-success ms-3">Finalizar compra</button>
      </div>
    `;

    containerCarrito.innerHTML = html;

    // después de insertar HTML, enlazo listeners
    enlazarControles();
    actualizarNotifBadge(carrito);
  }

  // Enlaza listeners para botones +/- , eliminar y abrir modal (en la vista render)
  function enlazarControles() {
    const carrito = obtenerCarrito();

    // cantidad inputs
    document.querySelectorAll(".producto-card").forEach(fila => {
      const index = Number(fila.dataset.index);
      const inputCantidad = fila.querySelector(".input-cantidad");
      const btnSumar = fila.querySelector(".btn-sumar");
      const btnRestar = fila.querySelector(".btn-restar");
      const btnEliminar = fila.querySelector(".btn-eliminar");

      if (!inputCantidad) return;

      inputCantidad.addEventListener("input", (e) => {
        let val = Number(e.target.value) || 1;
        if (val < 1) val = 1;
        e.target.value = val;

        carrito[index].quantity = val;
        guardarCarrito(carrito);
        // actualizar subtotal y total en DOM
        actualizarFilaDOM(fila, carrito[index]);
      });

      btnSumar && btnSumar.addEventListener("click", () => {
        let val = Number(inputCantidad.value) || 1;
        val++;
        inputCantidad.value = val;
        carrito[index].quantity = val;
        guardarCarrito(carrito);
        actualizarFilaDOM(fila, carrito[index]);
      });

      btnRestar && btnRestar.addEventListener("click", () => {
        let val = Number(inputCantidad.value) || 1;
        if (val > 1) val--;
        inputCantidad.value = val;
        carrito[index].quantity = val;
        guardarCarrito(carrito);
        actualizarFilaDOM(fila, carrito[index]);
      });

      // eliminar producto
      btnEliminar && btnEliminar.addEventListener("click", () => {
        carrito.splice(index, 1);
        guardarCarrito(carrito);
        // re-render completo
        renderCarrito();
      });
    });

    // Listener para abrir modal (botón Finalizar compra que acabamos de inyectar)
    const btnAbrir = document.getElementById("btnFinalizarCompra");
    if (btnAbrir) {
      btnAbrir.addEventListener("click", () => {
        abrirModalCompra();
      });
    }
  }

  // Actualiza subtotal de una fila y total general
  function actualizarFilaDOM(fila, producto) {
    const price = Number(producto.price) || 0;
    const qty = Number(producto.quantity) || 0;
    const subtotalNum = producto.currency === "USD" ? price * qty * tasaUSDaUYU : price * qty;
    fila.querySelector(".subtotal").textContent = `UYU ${formatUYU(subtotalNum)}`;
    // actualizar total general
    const carrito = obtenerCarrito();
    document.getElementById("total").textContent = `TOTAL: ${calcularTotalFormat(carrito)} UYU`;
  }

  // Modal: abrir, cerrar, actualizar montos
  function abrirModalCompra() {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      return alert("El carrito está vacío.");
    }
    // actualizar subtotales en modal
    subtotalCompraEl.textContent = `${calcularTotalFormat(carrito)} UYU`;
    // limpiar costo envio por defecto
    costoEnvioEl.textContent = formatUYU(0);
    totalFinalEl.textContent = subtotalCompraEl.textContent;

    // mostrar modal
    modal && modal.classList.remove("d-none");
  }

  btnCerrarModal && btnCerrarModal.addEventListener("click", () => {
    modal && modal.classList.add("d-none");
  });

  // Escuchar cambio en radios de envío para calcular costo de envío (ejemplo porcentual como en prototipo)
  envioRadios().forEach(r => {
    r.addEventListener("change", calcularCostoEnvioModal);
  });

  function calcularCostoEnvioModal() {
    const carrito = obtenerCarrito();
    const subtotalNum = calcularTotalNumerico(carrito);
    const seleccionado = envioRadios().find(r => r.checked);
    let costo = 0;
    if (seleccionado) {
      if (seleccionado.value === "premium") costo = subtotalNum * 0.15;
      if (seleccionado.value === "express") costo = subtotalNum * 0.07;
      if (seleccionado.value === "standard") costo = subtotalNum * 0.05;
    }
    costoEnvioEl.textContent = `${formatUYU(costo)} UYU`;
    totalFinalEl.textContent = `${formatUYU(subtotalNum + costo)} UYU`;
  }

  // Cambios en forma de pago para mostrar inputs como en modal
  pagoRadios().forEach(p => {
    p.addEventListener("change", () => {
      document.getElementById("pago-tarjeta")?.classList.add("d-none");
      document.getElementById("pago-transferencia")?.classList.add("d-none");
      if (p.value === "tarjeta") document.getElementById("pago-tarjeta")?.classList.remove("d-none");
      if (p.value === "transferencia") document.getElementById("pago-transferencia")?.classList.remove("d-none");
    });
  });

  // Confirmar compra: validaciones completas
  btnConfirmarCompra && btnConfirmarCompra.addEventListener("click", () => {
    const carrito = obtenerCarrito();
    if (!carrito || carrito.length === 0) return alert("El carrito está vacío.");

    // Validar envío
    const envioSeleccionado = envioRadios().find(r => r.checked);
    if (!envioSeleccionado) return alert("Debe seleccionar un tipo de envío.");

    // Validar dirección
    if (!departamentoEl?.value || !localidadEl?.value || !calleEl?.value || !numeroEl?.value || !esquinaEl?.value) {
      return alert("Debe completar todos los datos de la dirección.");
    }

    // Validar cantidades
    for (const p of carrito) {
      if (!p.quantity || Number(p.quantity) <= 0) return alert("Todas las cantidades deben ser mayores a 0.");
    }

    // Validar forma de pago
    const pagoSeleccionado = pagoRadios().find(r => r.checked);
    if (!pagoSeleccionado) return alert("Debe seleccionar una forma de pago.");

    if (pagoSeleccionado.value === "tarjeta") {
      if (!tarjetaNumEl?.value || !tarjetaNombreEl?.value) return alert("Complete los datos de la tarjeta.");
    } else if (pagoSeleccionado.value === "transferencia") {
      if (!cuentaBancariaEl?.value) return alert("Ingrese el número de cuenta bancaria.");
    }

    // Si todo ok, mostrar éxito (ficticio) y vaciar carrito
    alert("🎉 Compra realizada con éxito. Gracias por su compra.");
    localStorage.removeItem("carrito");
    // cerrar modal y re-render
    modal && modal.classList.add("d-none");
    renderCarrito();
  });

  // Render inicial
  renderCarrito();
});

const ciudadesPorDepartamento = {
  Artigas: ["Artigas", "Bella Unión",],
  Canelones: ["Canelones", "Las Piedras", "La Paz", "Ciudad de la Costa", "Pando", "Barros Blancos", "Progreso", "Santa Lucía",],
  CerroLargo: ["Melo", "Rio Branco"],
  Colonia: ["Colonia del Sacramento", "Carmelo", "Nueva Helvecia"],
  Durazno: ["Durazno", "Sarandí del Yí"],
  Flores: ["Trinidad"],
  Florida: ["Florida", "Sarandí Grande"],
  Lavalleja: ["Minas"],
  Maldonado: ["Maldonado", "Punta del Este", "Piriápolis"],
  Montevideo: ["Montevideo"],
  Paysandu: ["Paysandú", "Guichón"],
  RioNegro: ["Fray Bentos", "Young", "San Javier", "Nuevo Berlín"],
  Rivera: ["Rivera", "Tranqueras"],
  Rocha: ["Rocha", "Chuy", "La Paloma"],
  Salto: ["Salto"],
  SanJose: ["San José de Mayo", "Libertad"],
  Soriano: ["Mercedes", "Dolores"],
  Tacuarembo: ["Tacuarembó", "San Gregorio de Polanco"],
  TreintaYTres: ["Treinta y Tres"]
};


const departamentoSelect = document.getElementById("departamentoSelect");
const ciudadSelect = document.getElementById("ciudadSelect");

departamentoSelect.addEventListener("change", () => {
  const depto = departamentoSelect.value;

  // Limpiar ciudades actuales
  ciudadSelect.innerHTML = "<option value=''>Seleccione una ciudad</option>";

  if (!depto || !ciudadesPorDepartamento[depto]) return;

  // Agregar ciudades del departamento elegido
  ciudadesPorDepartamento[depto].forEach(ciudad => {
    const option = document.createElement("option");
    option.value = ciudad;
    option.textContent = ciudad;
    ciudadSelect.appendChild(option);
  });
});