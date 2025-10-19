// Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  const modoOscuroDiv = document.getElementById("MODO-OSCURO");

  // Crear botón dinámicamente
  const boton = document.createElement("button");
  modoOscuroDiv.appendChild(boton);

  // Verificar si el modo oscuro estaba activado antes
  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
    boton.textContent = "Modo Claro";
  } else {
    boton.textContent = "Modo Oscuro";
  }

  // Cambiar modo al hacer clic
  boton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const modoActivo = document.body.classList.contains("dark-mode");
    boton.textContent = modoActivo ? "Modo Claro" : "Modo Oscuro";

    // Guardar el estado en localStorage
    localStorage.setItem("modoOscuro", modoActivo);
  });
});
