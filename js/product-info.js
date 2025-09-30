// Obtener ID y categoría desde URL
const params = new URLSearchParams(window.location.search);
let productoId = parseInt(params.get("id")) || 1;
let categoria = params.get("cat") || "101";

// Referencias al HTML
const nombreEl = document.getElementById("nombreProducto");
const categoriaEl = document.getElementById("categoriaProducto");
const descripcionEl = document.getElementById("descripcionProducto");
const vendidosEl = document.getElementById("vendidosProducto");
const imagenesEl = document.getElementById("imagenesProducto");
const relacionadosEl = document.getElementById("productosRelacionados");

// Función principal para cargar producto
function cargarProducto(id, cat) {
  const apiUrl = `https://japceibal.github.io/emercado-api/cats_products/${cat}.json`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo cargar la API");
      return res.json();
    })
    .then(data => {
      const producto = data.products.find(p => p.id === id);
      if (!producto) {
        nombreEl.textContent = "Producto no encontrado";
        return;
      }

      // Renderizar info del producto
      nombreEl.textContent = producto.name || "Sin nombre";
      categoriaEl.textContent = producto.category || cat || "Sin categoría";
      descripcionEl.textContent = producto.description || "Sin descripción";
      vendidosEl.textContent = producto.soldCount || 0;

      // Renderizar imágenes
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

      // Renderizar productos relacionados
      renderRelacionados(producto, data.products);
    })
    .catch(error => {
      console.error("Error al cargar el producto:", error);
      nombreEl.textContent = "Error al cargar el producto";
    });
}

// Función para renderizar productos relacionados
function renderRelacionados(productoActual, todosProductos) {
  relacionadosEl.innerHTML = "";

  // Tomamos hasta 4 productos diferentes al actual
  const relacionados = todosProductos.filter(p => p.id !== productoActual.id).slice(0, 4);

  relacionados.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "10rem";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${p.image || p.images?.[0] || 'img/no-image.png'}" class="card-img-top" alt="${p.name}">
      <div class="card-body p-2">
        <p class="card-title small">${p.name}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      // Actualizar variables y recargar contenido sin recargar la página
      productoId = p.id;
      categoria = p.category || categoria;
      cargarProducto(productoId, categoria);
      // Reiniciar carousel a primera imagen
      const carousel = bootstrap.Carousel.getInstance(document.getElementById("carouselProducto"));
      if (carousel) carousel.to(0);
    });

    relacionadosEl.appendChild(card);
  });
}

// Inicializar la página
cargarProducto(productoId, categoria);
