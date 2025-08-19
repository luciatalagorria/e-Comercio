document.addEventListener("DOMContentLoaded", () => { //evento que se dispara cuando el HTML de la página ha sido completamente cargado. Si no se cargan antes puede dar errores.
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evita el envío automático para no perder los datos

    if (email.value.trim() === "" || password.value.trim() === "") {
      alert("Debes completar usuario y contraseña");
      return;
    }

    // Autenticación ficticia 
    localStorage.setItem("usuario", email.value);

    // Redirige a la portada
    window.location.href = "index.html";
  });
});




