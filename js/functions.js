// DEFINITION CURRENT URL & RECUPERATION VARIABLES GET DANS URL
const currentUrl = window.location.pathname.split("/").pop();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const myId = (urlParams.get('myId') === null) ? "" : urlParams.get("myId");
const myUrl = (urlParams.get('myUrl') === null) ? "" : urlParams.get("myUrl");
// DEFINITION MAIN DIV POUR AFFICHAGE PRODUITS
const mainDiv = document.querySelector("main");
// DEFINITION DIV REFERENCE POUR AFFICHAGE PANIER
const cartDiv = document.getElementById("cartDiv");
// CREATION DIV LATERAL (POUR CONFIRMATION AJOUT PANIER)
const divLateral = createEle("div", "div-lateral", ["p-2"], "", "");
const divLatHeader = createEle("div", "", ["mt-2", "mb-2", "text-white", "text-right"], "", "", divLateral);
createEle("a", "closeLateral", "", { "href": "#", "title": "Fermer cette fenêtre" }, "<i class=\"far fa-times-circle\"></i>", divLatHeader);
const divLatBody = createEle("div", "", ["mt-4", "mb-4", "text-white"], "", "", divLateral);
const divLatH2 = createEle("h2", "lateralH2", "", "", "", divLatBody);
createEle("a", "", "", { "href": "panier.html", "title": "Rendez-vous sur la page de votre panier." }, "<u>Voir mon panier</u>", divLatBody);
// API
const apiUrl_tmp = "http://localhost:3000/api/teddies/";
const apiUrl = "https://oc-p5-api.herokuapp.com/api/teddies/";


// ----------------------- SWITCH SELON CURRENT URL -------------------------------//

window.addEventListener('load', function () {
  switch (currentUrl) {
    case "index.html":
      // Sur page Index, affichage de tous les produits
      getAllProducts({ "nbMax": "" });
      break;
    case "product.html":
      // Sur page Produit, affichage du produit dont l'ID est passé en Url. Si pas d'id, retour à index
      if (myId != "") {
        getOneProduct("prepend");
        getAllProducts({ "nbMax": 3 });
      } else {
        window.location.href = "index.html";
      }
      break;
    case "panier.html":
      // Sur page Panier, affichage du panier (voir functionsCart.js)
      displayCart();
      // ECOUTEUR SUR L'ENVOIR DU FORMULAIRE
      const mainForm = document.getElementById("mainForm");
      mainForm.addEventListener("submit", function (eve) {
        eve.preventDefault();
        letsGo = checkForm();
        if (letsGo === true) {
          checkoutCart();
        }
      });
      break;
    case "confirmation.html":
      if (window.localStorage.getItem("checkout") !== null) {
        displayConfirm(JSON.parse(window.localStorage.getItem("checkout")));
        window.localStorage.removeItem("checkout");
      } else {
        window.location.href = "index.html";
      }
  }
});


// ----------------------- FONCTIONS AFFICHAGE PRODUITS ---------------------------//

// FONCTIONS AFFICHAGE 1 PRODUIT POUR PAGE PRODUIT
function displayOneCard(array, options) {
  // Div principal 
  const newOneCard = createEle("div", "mainOneCard", ["row", "align-items-center", "my-5"], "", "");
  switch (options.pend) {
    case "prepend":
      mainDiv.prepend(newOneCard);
      break;
    default:
      mainDiv.appendChild(newOneCard);
      break;
  }
  // Div image
  const newImgDiv = createEle("div", "", ["col-lg-7"], "", "", newOneCard);
  createEle("img", "", ["img-fluid", "rounded", "mb-4", "mb-lg-0"], { "src": array.imageUrl }, "", newImgDiv);
  // Div info
  const newInfoDiv = createEle("div", "", ["col-lg-5"], "", "", newOneCard);
  // Titre avec prix
  createEle("h1", "", "", "", "<span>" + array.name + "</span><span>" + displayPrice(array.price / 100) + "<span>", newInfoDiv);
  // Description 
  createEle("p", "", "", "", array.description, newInfoDiv);
  // Label couleur
  const newLabelColor = createEle("label", "", "", { "for": "selectColor" }, "Couleurs disponibles : ", newInfoDiv);
  const newSelectColor = createEle("select", "selectColor", "", { "name": "selectColor", "dir": "ltr" }, "", newLabelColor);
  for (let ele of array.colors) {
    createEle("option", "", "", "", ele, newSelectColor);
  }
  // Label quantité
  const newLabelQty = createEle("label", "", "", { "for": "inputQty" }, "Quantité : ", newInfoDiv);
  const newSelectQty = createEle("select", "inputQty", "", { "name": "inputQty", "dir": "ltr" }, "", newLabelQty);
  for (let i = 1; i < 1000; i++) {
    createEle("option", "", "", "", i, newSelectQty);
  }
  // Bouton ajouter
  createEle("a", "addToCart", ["btn", "btn-primary"], { "data-id": array._id, "data-price": array.price, "data-action": "addToCart" }, "<i class=\"fas fa-cart-plus\"></i> Ajouter au panier", newInfoDiv);
}
// APPEL DE LA FONCTION PRECEDENTE AVEC LES DONNEES JSON
async function getOneProduct(pend) {
  await fetch(apiUrl + myId)
    .then((response) => response.json())
    .then((nounours) => displayOneCard(nounours, { "pend": pend }))
}

// FONCTIONS AFFICHAGE DE TOUS LES PRODUITS
function displayAllCard(array, options) {
  let loading = document.querySelector('.loading').remove();
  let nbTmp = 0;
  let mainProducts = createEle("div", "", ["row", "text-center"], "", "", mainDiv);
  for (let ele of array) {
    if (ele._id != myId && nbTmp < options.nbMax) {
      // Div princpal carte
      const newArticle = createEle("div", "", ["col-lg-4", "col-md-6", "mb-4"], "", "", mainProducts);
      // Div secondaire carte
      const newCard = createEle("div", "", ["card", "h-100"], "", "", newArticle);
      // Div image
      createEle("img", "", ["card-img-top"], { "src": ele.imageUrl, "alt": ele.name }, "", newCard);
      // Div infos
      const newInfoDiv = createEle("div", "", ["card-body"], "", "", newCard);
      createEle("h2", "", ["card-title"], "", ele.name, newInfoDiv);
      createEle("p", "", ["card-text"], "", ele.description, newInfoDiv);
      // Div Footer
      const newFooter = createEle("div", "", ["card-footer"], "", "", newCard);
      const newButton = createEle("a", "", "", { "href": "product.html?myId=" + ele._id }, "", newFooter);
      createEle("button", "", ["btn", "btn-primary"], "", "<i class=\"far fa-eye\"></i> Découvrir !", newButton);
      nbTmp++;
    }
  }
}
// APPEL DE LA FONCTION PRECEDENTE AVEC LES DONNEES JSON
async function getAllProducts(options) {
  let loading = createEle("h2", "", ["loading"], "", "Loading", mainDiv);
  await fetch(apiUrl)
    .then((response) => response.json())
    .then((nounours) => displayAllCard(nounours, { "nbMax": ((options.nbMax != "") ? options.nbMax : nounours.length) }))
}


// --------------------------- FONCTIONS BASIQUES ------------------------------//

// FONCTION CREATION ELEMENT SELON ARGUMENTS
function createEle(_type = "div", _id = "", _class = [], _attribute = [], _content = "", _parent) {
  // Création de l'élément
  const e = document.createElement(_type);
  // Ajout Id si existe
  if (_id != "") {
    e.setAttribute("id", _id);
  }
  // Ajout classe(s) si existe(nt)
  if (Array.isArray(_class) && _class.length != 0) {
    for (let ele of _class) {
      e.classList.add(ele);
    }
  }
  // Ajout attribut(s) si existe(nt)
  if (_attribute.length != 0) {
    for (const [key, value] of Object.entries(_attribute)) {
      e.setAttribute(key, value);
    }
  }
  // Ajout contenu si existe
  if (_content != "") {
    e.innerHTML = _content;
  }
  // Si élément parent renseigné, on ajoute le nouvel élément à son parent, sinon on renvoie l'élément créé
  if (typeof (_parent) != 'undefined' && _parent != null) {
    _parent.appendChild(e);
  }
  return e;
}

// FONCTION AFFICHAGE PRIX FRANCE
function displayPrice(_price) {
  const newPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(_price);
  return newPrice;
}

// CREATION BANDEAU LATERAL ET CONTROLE FERMETURE
if (currentUrl != "panier.html") {
  document.body.prepend(divLateral);
}
document.addEventListener("click", function (e) {
  if (e.target.id == "closeLateral") {
    e.preventDefault();
    divLateral.classList.remove("active");
  }
});

// FONCTION CONTROLE FORMULAIRE
function checkForm() {
  let result = true;
  const inputs = document.getElementById("mainForm").querySelectorAll("input");
  inputs.forEach(element => {
    element.classList.remove("invalide");
    let regExTest = "";
    switch (element.getAttribute("type")) {
      case "text":
        regExTest = /^[a-zA-Z0-9 ']*$/;
        break;
      case "email":
        regExTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      default:
        regExTest = /^[a-zA-Z0-9]*$/;
        break;
    }
    if (!regExTest.test(element.value)) {
      element.classList.add("invalide");
      result = "false";
    }
  });
  console.log(result);
  return result;
}