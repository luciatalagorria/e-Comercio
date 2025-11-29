 
 const categoria = localStorage.getItem("catID");

    const contenedor = document.getElementById("productos");


  fetch(`http://localhost:3000/cats_products/${categoria}.json`)
    .then(response => response.json())
    .then(data => {
      data.products.forEach(product => {
        contenedor.innerHTML += `
  <div class="col-12">
    <div class="card h-100 shadow-sm" style="cursor:pointer;" onclick="window.location.href='product-info.html?cat=${categoria}&id=${product.id}'">
      <img src="${product.image}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <h5 class="card-title"><strong>${product.name}</strong></h5>
        <p class="card-text">${product.description}</p>
      </div>
      <div class="card-footer">
        <span class="fw-bold">${product.currency} ${product.cost}</span>
        <small class="text-muted">Vendidos: ${product.soldCount}</small>
      </div>
    </div>
  </div>
`;
      });
    })
    .catch(error => console.error("Error cargando productos:", error));

//Definicion de variables

let inputMin = document.getElementById("precioMin");
let inputMax = document.getElementById("precioMax");
let btnFiltrar = document.getElementById("botonFiltro");
let btnLimpiar = document.getElementById("botonLimpiar");
let selectOrden = document.getElementById("ordenarSelector");

let productosOriginales = []; // los que vienen de la API
let productosMostrados = [];

// Cargar productos desde la API
fetch(`http://localhost:3000/cats_products/${categoria}.json`)
  .then(response => response.json())
  .then(data => {
    productosOriginales = data.products;
    productosMostrados = [...productosOriginales]; 
    mostrarProductos(productosMostrados);
  })
  .catch(error => console.error("Error cargando productos:", error));

  // Mostrar productos filtrados 
function mostrarProductos(lista) {
  contenedor.innerHTML = "";
  lista.forEach(product => {
    contenedor.innerHTML += `
      <div class="col-12">
        <div class="card h-100 shadow-sm" style="cursor:pointer;" 
             onclick="window.location.href='product-info.html?cat=${categoria}&id=${product.id}'">
          <img src="${product.image}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title"><strong>${product.name}</strong></h5>
            <p class="card-text">${product.description}</p>
          </div>
          <div class="card-footer">
            <span class="fw-bold">${product.currency} ${product.cost}</span>
            <small class="text-muted">Vendidos: ${product.soldCount}</small>
          </div>
        </div>
      </div>
    `;
  });
}

  //Filtrar por precio
btnFiltrar.addEventListener("click", () => {
  const min = parseInt(inputMin.value) || 0;
  const max = parseInt(inputMax.value) || Infinity;

  productosMostrados = productosOriginales.filter(p => p.cost >= min && p.cost <= max);
  aplicarOrden();
});

//Limpiar filtros
btnLimpiar.addEventListener("click", () => {
  inputMin.value = "";
  inputMax.value = "";
  selectOrden.value = "precioAsc";
  productosMostrados = [...productosOriginales];
  mostrarProductos(productosMostrados);
});

//Ordenar
selectOrden.addEventListener("change", () => {
  aplicarOrden();
});

function aplicarOrden() {
  const criterio = selectOrden.value;

  if (criterio === "precioAsc") {
    productosMostrados.sort((a, b) => a.cost - b.cost);
  } else if (criterio === "precioDesc") {
    productosMostrados.sort((a, b) => b.cost - a.cost);
  } else if (criterio === "relevancia") {
    productosMostrados.sort((a, b) => b.soldCount - a.soldCount);
  }

  mostrarProductos(productosMostrados);
}