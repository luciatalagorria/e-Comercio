 
    const contenedor = document.getElementById("productos");

  fetch("https://japceibal.github.io/emercado-api/cats_products/101.json")
    .then(response => response.json())
    .then(data => {
      data.products.forEach(product => {
        contenedor.innerHTML += `

          <div class="col-12">

            <div class="card h-100 shadow-sm">
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
