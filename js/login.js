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

    try {
      const respuesta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert(data.error); // mensaje del backend
        return;
      }

      // Guardar token
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", email.value);

      window.location.href = "index.html";
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Error al iniciar sesión.");
    }
  });
});