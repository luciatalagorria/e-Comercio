document.addEventListener("DOMContentLoaded", () => {
  const usuario = localStorage.getItem("usuario");
  const usuarioNav = document.getElementById("usuario-nav");

  if (usuario && usuarioNav) {
    usuarioNav.textContent = usuario;
  }
});