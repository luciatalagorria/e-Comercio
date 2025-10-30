
document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuario");
  const usuarioNav = document.getElementById("usuario-nav");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (usuario) {
    // Mostrar nombre/email en el icono del usuario
    usuarioNav.textContent = " " + usuario;

    // Reemplazar el contenido del menú desplegable
    dropdownMenu.innerHTML = `
  <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
  <li><button class="modo-oscuro-btn">Modo Oscuro</button></li>
  <li><a class="dropdown-item" id="cerrar-sesion" href="#">Cerrar sesión</a></li>
`;

    // Agregar funcionalidad al botón "Cerrar sesión"
    document.getElementById("cerrar-sesion").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      localStorage.removeItem("perfil");
      window.location.href = "login.html";
    });

  } else {
    // Si no hay usuario logueado, mostrar solo "Iniciar sesión"
    usuarioNav.textContent = "";
    dropdownMenu.innerHTML = `
      <li><a class="dropdown-item" href="login.html">Iniciar sesión</a></li>
    `;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("notif-badge");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Mostrar la cantidad total de productos distintos
  badge.textContent = carrito.length;

  // Ocultar el círculo si no hay productos
  if (carrito.length === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "inline-block";
  }
});