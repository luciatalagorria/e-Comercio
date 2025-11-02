
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
const precioProductoEl = document.getElementById("precioProducto");
const monedaProductoEl = document.getElementById("monedaProducto");

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
      precioProductoEl.textContent = producto.cost || "0";
      monedaProductoEl.textContent = producto.currency || "";

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
  productoId = p.id;
  categoria = p.category || categoria;

  // Cargar el nuevo producto
  cargarProducto(productoId, categoria);

  // 🔹 Cargar los comentarios del nuevo producto
  cargarComentarios(productoId);

  // Reiniciar el carousel a la primera imagen
  const carousel = bootstrap.Carousel.getInstance(document.getElementById("carouselProducto"));
  if (carousel) carousel.to(0);
});

    relacionadosEl.appendChild(card);
  });
}

// Inicializar la página
cargarProducto(productoId, categoria);

//////////////////////////////////////////
// ⭐⭐⭐ Lógica de las estrellas de calificación ⭐⭐⭐
const stars = document.querySelectorAll("#rating-stars i");
let selectedRating = 0; // Calificación guardada

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

stars.forEach((star, index) => {
  const ratingValue = index + 1;

  star.addEventListener("mouseover", () => highlightStars(ratingValue));
  star.addEventListener("mouseout", () => highlightStars(selectedRating));
  star.addEventListener("click", () => {
    selectedRating = ratingValue;
    highlightStars(selectedRating);
    console.log("Calificación seleccionada:", selectedRating);
  });
});

// Mostrar todo vacío al inicio
highlightStars(0);

//////////////////////////////////////////
// Función para renderizar estrellas en comentarios
function getStars(score) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      starsHTML += '<i class="fa-solid fa-star text-warning"></i>'; // estrella llena
    } else {
      starsHTML += '<i class="fa-regular fa-star text-warning"></i>'; // estrella vacía
    }
  }
  return starsHTML;
}

const contenedorComentarios = document.getElementById("product-comments");

// 🔹 Nueva función para cargar comentarios dinámicamente
function cargarComentarios(id) {
  contenedorComentarios.innerHTML = ""; // Limpia los comentarios anteriores

  fetch(`https://japceibal.github.io/emercado-api/products_comments/${id}.json`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) {
        contenedorComentarios.innerHTML = "<p class='text-muted'>No hay comentarios para este producto.</p>";
        return;
      }

      data.forEach(comment => {
        const comentario = document.createElement("div");
        comentario.className = "mb-3 border-bottom pb-2";
        comentario.innerHTML = `
          <strong>${comment.user}</strong> - <span class="text-muted">${comment.dateTime}</span>
          <div>${getStars(comment.score)}</div>
          <p>${comment.description}</p>
        `;
        contenedorComentarios.appendChild(comentario);
      });
    })
    .catch(error => {
      console.error("Error al cargar los comentarios:", error);
      contenedorComentarios.innerHTML = "<p class='text-danger'>Error al cargar los comentarios.</p>";
    });

  }

   // Funcionalidad del botón "Comprar"

btnComprar.addEventListener("click", () => {
  const producto = {
    id: productoId,
    name: document.getElementById("nombreProducto").textContent,
    category: document.getElementById("categoriaProducto").textContent,
    description: document.getElementById("descripcionProducto").textContent,
    soldCount: document.getElementById("vendidosProducto").textContent,
    image: document.querySelector("#imagenesProducto img")?.src || "img/no-image.png",
    price: precioProductoEl.textContent,
    currency: monedaProductoEl.textContent,
    quantity: 1,
  };

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existing = carrito.find(p => p.id === producto.id);
  if (existing) existing.quantity += 1;
  else carrito.push(producto);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  window.location.href = "cart.html";
});