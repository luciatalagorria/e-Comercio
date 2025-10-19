const email = localStorage.getItem("usuario");
const contenedorEmail = document.getElementById("contenedor-email");
if (email && contenedorEmail) {
  contenedorEmail.value = email;       // mostrar el email guardado
  contenedorEmail.readOnly = true;     // opcional: evita que se edite
}

// Campos del formulario
const nombre = document.getElementById("name");
const apellido = document.getElementById("surname");
const telefono = document.getElementById("phone");

// Guardar datos del perfil
document.getElementById("profileForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita recargar la página

  const perfil = {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    telefono: telefono.value.trim()
  };

  localStorage.setItem("perfil", JSON.stringify(perfil));
  alert("Perfil guardado exitosamente.");
});

// Cargar datos del perfil
const perfilGuardado = JSON.parse(localStorage.getItem("perfil"));
if (perfilGuardado) {
  if (perfilGuardado.nombre) nombre.value = perfilGuardado.nombre;
  if (perfilGuardado.apellido) apellido.value = perfilGuardado.apellido;
  if (perfilGuardado.telefono) telefono.value = perfilGuardado.telefono;
};

// --- Foto de Perfil ---
const defaultImage = "img/imagenXDefecto.png";
const profileImage = document.getElementById("profileImage");
const imageInput = document.getElementById("imageInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const removePhotoBtn = document.getElementById("removePhotoBtn");

changePhotoBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profileImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Eliminar foto de perfil
removePhotoBtn.addEventListener("click", () => {
  profileImage.src = defaultImage;
  imageInput.value = ""; 
});