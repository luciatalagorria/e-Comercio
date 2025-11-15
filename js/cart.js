
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
