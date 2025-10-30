document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("containerCarrito");
  const emptyMessage = document.getElementById("carrVacio");
  const tituloCarrito = document.getElementById("tituloCarrito");

  const carritoGuardado = localStorage.getItem("carrito");

  if (!carritoGuardado) {
    tituloCarrito.classList.add("d-none");
    emptyMessage.classList.remove("d-none");
    return;
  }

  const carrito = JSON.parse(carritoGuardado);

  if (carrito.length === 0) {
    emptyMessage.classList.remove("d-none");
    return;
  }

  let html = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Nombre</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
  `;

  let total = 0;

  carrito.forEach((prod, i) => {
    const subtotal = prod.price * prod.quantity;
    total += subtotal;

    html += `
      <tr data-index="${i}">
        <td><img src="${prod.image}" class="cart-img" alt="${prod.name}"></td>
        <td>${prod.name}</td>
        <td>${prod.currency} ${prod.price}</td>
        <td>
          <input type="number" min="1" value="${prod.quantity}" class="input-cantidad">
        </td>
        <td class="subtotal">${prod.currency} ${subtotal}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
    <div class="total-container">
      <h4 id="total">TOTAL: UYU ${total}</h4>
      <button class="btn btn-finalizar ms-3">Finalizar compra</button>
    </div>
  `;

  cartContainer.innerHTML = html;

  // Actualizar cantidades y totales
  const inputs = document.querySelectorAll(".input-cantidad");
  inputs.forEach(input => {
    input.addEventListener("change", e => {
      const fila = e.target.closest("tr");
      const index = fila.dataset.index;
      const producto = carrito[index];

      producto.quantity = parseInt(e.target.value);
      const nuevoSubtotal = producto.price * producto.quantity;
      fila.querySelector(".subtotal").textContent = `${producto.currency} ${nuevoSubtotal}`;

      // Guardar cambios en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Actualizar total general
      const nuevoTotal = carrito.reduce((acc, p) => acc + (p.price * p.quantity), 0);
      document.getElementById("total").textContent = `TOTAL: UYU ${nuevoTotal}`;
    });
  });
});
