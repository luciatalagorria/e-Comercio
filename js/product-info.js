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


// Función para renderizar estrellas
function getStars(score) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= score) {
      stars += '<i class="fa-solid fa-star text-warning"></i>'; // estrella llena
    } else {
      stars += '<i class="fa-regular fa-star text-warning"></i>'; // estrella vacía
    }
  }
  return stars;
}

const contenedorComentarios = document.getElementById("product-comments");

fetch(`https://japceibal.github.io/emercado-api/products_comments/${productoId}.json`)
  .then(res => res.json())
  .then(data => { 
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
  .catch(error => console.error("Error al cargar los comentarios:", error));
