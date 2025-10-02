// 1️⃣ Obtener ID y categoría desde la URL
const params = new URLSearchParams(window.location.search);
const productoId = parseInt(params.get("id")); // ID del producto
const categoria = params.get("cat");           // Categoría numérica, ej: "101"

// 2️⃣ Referencias al HTML
const nombreEl = document.getElementById("nombreProducto");
const categoriaEl = document.getElementById("categoriaProducto");
const descripcionEl = document.getElementById("descripcionProducto");
const vendidosEl = document.getElementById("vendidosProducto");
const imagenesEl = document.getElementById("imagenesProducto");

// 3️⃣ Verificar que tengamos ID y categoría
if (!productoId || !categoria) {
  nombreEl.textContent = "Producto no encontrado";
} else {
  const apiUrl = `https://japceibal.github.io/emercado-api/cats_products/${categoria}.json`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar la API");
      return res.json();
    })
    .then(productos => {
      console.log("Productos de la categoría:", productos); // Para depuración

      // 4️⃣ Buscar el producto por ID
      const producto = productos.products.find(p => p.id === productoId);

      if (!producto) {
        nombreEl.textContent = "Producto no encontrado";
        return;
      }

      // 5️⃣ Llenar los campos del HTML
      nombreEl.textContent = producto.name || "Sin nombre";
      categoriaEl.textContent = producto.category || categoria || "Sin categoría";
      descripcionEl.textContent = producto.description || "Sin descripción";
      vendidosEl.textContent = producto.soldCount || 0;

      // 6️⃣ Llenar carousel de imágenes
      
      imagenesEl.innerHTML = "";

      let imagenes = producto.images || (producto.image ? [producto.image] : []);

      if (imagenes.length > 0) {
        imagenes.forEach((img, index) => {
          const div = document.createElement("div");
          div.className = `carousel-item ${index === 0 ? "active" : ""}`;
          div.innerHTML = `<img src="${img}" class="d-block w-100" alt="Imagen ${index + 1}">`;
          imagenesEl.appendChild(div);
        });
} else {
  imagenesEl.innerHTML = "<p>No hay imágenes disponibles</p>";
}
    })
    .catch(error => {
      console.error("Error al cargar el producto:", error);
      nombreEl.textContent = "Error al cargar el producto";
    });
}

// ⭐⭐⭐ Lógica de las estrellas de calificación ⭐⭐⭐
const stars = document.querySelectorAll("#rating-stars i");
let selectedRating = 0; // Calificación guardada

// Función para "pintar" estrellas
function highlightStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.remove("fa-regular");
      star.classList.add("fa-solid"); // Llena la estrella
    } else {
      star.classList.remove("fa-solid");
      star.classList.add("fa-regular"); // Vacía la estrella
    }
  });
}

// Eventos para cada estrella
stars.forEach((star, index) => {
  const ratingValue = index + 1;

  // Hover → mostrar llenado hasta esa estrella
  star.addEventListener("mouseover", () => {
    highlightStars(ratingValue);
  });

  // Salir con mouse → volver al estado guardado
  star.addEventListener("mouseout", () => {
    highlightStars(selectedRating);
  });

  // Click → guardar la selección
  star.addEventListener("click", () => {
    selectedRating = ratingValue;
    highlightStars(selectedRating);
    console.log("Calificación seleccionada:", selectedRating);
  });
});

// Al cargar, mostrar todo vacío
highlightStars(0);
