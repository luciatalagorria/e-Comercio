const API_BASE = "http://localhost:3000/";

const CATEGORIES_URL = API_BASE + "cats/cat.json";
const PUBLISH_PRODUCT_URL = API_BASE + "sell/publish.json";
const PRODUCTS_URL = API_BASE + "cats_products/";
const PRODUCT_INFO_URL = API_BASE + "products/";
const PRODUCT_INFO_COMMENTS_URL = API_BASE + "products_comments/";
const CART_INFO_URL = API_BASE + "user_cart/";
const CART_BUY_URL = API_BASE + "cart/buy.json";

const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};

    // Agregamos el token guardado en localStorage
    const token = localStorage.getItem("token");

    let options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };
    showSpinner();
 return fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw Error(response.statusText);
        }
    })
    .then(function(response) {
        result.status = 'ok';
        result.data = response;
        hideSpinner();
        return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}