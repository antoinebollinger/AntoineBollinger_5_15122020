// SWITCH ACTION
document.addEventListener("click", function(e) {
  if (e.target) {
    switch (e.target.dataset.action) {
      case "addToCart": 
        e.preventDefault();
        const myColor = document.getElementById("selectColor");
        const myQty = document.getElementById("inputQty");
        addToCart(e.target.dataset.id, parseInt(myQty.value), myColor.value);
        break;
      case "refreshCart":
        e.preventDefault();
        const myIndex = e.target.dataset.index;
        const myNewQty = document.getElementById("quantite_"+myIndex);
        refreshCart(myIndex, myNewQty.value);
        console.log(myNewQty.value);
        break;
      case "removeFromCart": 
        e.preventDefault();
        removeFromCart(e.target.dataset.index);
        break;
      case "clearCart":
        e.preventDefault();
        clearCart();
        break;
    }
  }
});

const cartDiv = document.getElementById("cartDiv");

updateQtyCart();
displayCart();


// --------------------- AFFICHAGE PANIER --------------------------------//

function displayCart() {
  if (currentUrl == "panier.html") {
    updateQtyCart();
    cartDiv.innerHTML = "";
    const myCart = JSON.parse(window.localStorage.getItem("products"));
    for (let ele of myCart) {
      displayProduct(ele, myCart.indexOf(ele));
    }
    createEle("div", "", "", "", JSON.stringify(myCart), cartDiv);
  }
}

async function displayProduct(array, index) {
  await fetch(apiUrl+array.id)
    .then((response) => response.json())
    .then((nounours) => createItem(nounours, index, array.color, array.quantity))
}

function createItem(array, _index, _color, _quantity) {
  const newProduct = createEle("div", "", ["row", "cart-product"], "", "", cartDiv);
  //Image
    const newDivImg = createEle("div", "", ["col", "col-sm", "col-md", "text-center"], "", "", newProduct);
      createEle("img", "", ["img-responsive"], {"src": array.imageUrl, "alt": "preview", "width": 120, "height": 80}, "", newDivImg);
    // Product Infos 
    const newDivInfo = createEle("div", "", ["col", "text-sm-center", "col-sm", "text-md-left", "col-md"], "", "", newProduct);
      createEle("h2", "", ["product-name"], "", array.name, newDivInfo);
      createEle("p", "", "", "", "Couleur : "+_color, newDivInfo);
    // Prix / Quantité, Supprimer
    const newProductSub = createEle("div", "", ["col", "col-sm", "text-sm-center", "col-md", "text-md-right", "row"], "", "", newProduct);
    // Prix
      const newDivPrix = createEle("div", "", ["col", "col-sm", "col-md", "text-md-right"], {"style": "padding-top:5px"}, "", newProductSub);
        createEle("h2", "", "", "", displayPrice(array.price / 100)+"&nbsp;<span class=\"text-muted\">x</span>&nbsp;", newDivPrix);
      // Quantité
      const newDivQte = createEle("div", "", ["col", "col-sm", "col-md"], "", "", newProductSub);
        const newDivQteSub = createEle("div", "", ["quantity"], "", "", newDivQte);
          createEle("input", "quantite_"+_index, ["qty"], {"type": "number", "value": _quantity, "step": 1, "min": 1, "title": "Qty", "size": 4}, "", newDivQteSub);
      const newDivActualiser = createEle("div", "", ["col", "col-sm", "col-md", "text-right"], "", "", newProductSub);
        createEle("a", "", ["btn", "btn-primary", "btn-xs", "a-refresh"], {"type": "button", "data-index": _index, "data-action": "refreshCart"}, "<i class=\"fas fa-sync-alt\"></i>", newDivActualiser);          
      const newDivSupprimer = createEle("div", "", ["col", "col-sm", "col-md", "text-right"], "", "", newProductSub);
        createEle("button", "", ["btn", "btn-outline-danger", "btn-xs"], {"type": "button", "data-index": _index, "data-action": "removeFromCart"}, "<i class=\"fa fa-trash\"></i>", newDivSupprimer);
}


// --------------------- FONCTIONS DE BASE PANIER -------------------------//

// FONCTION AJOUT PRODUIT
function addToCart(_id, _qty, _color) {
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (checkIsInCart(myCart, _id, _qty, _color)) {
    const newProduct = {"id": _id, "color": _color, "quantity" : _qty};
    myCart.push(newProduct);
    window.localStorage.removeItem("products");
    window.localStorage.setItem("products", JSON.stringify(myCart));
    updateQtyCart();
    alert("Votre article a bien été ajouté au panier.");
  }
}

// FONCTION MISE A JOUR PANIER 
function refreshCart(_index, _quantity) {
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  for (let ele of myCart) {
    if (myCart.indexOf(ele) == _index) {
      ele.quantity = parseInt(_quantity);
    }
  }
  window.localStorage.removeItem("products");
  window.localStorage.setItem("products", JSON.stringify(myCart));
  updateQtyCart();
  displayCart();
}

// FONCTION SUPPRIMER PRODUIT
function removeFromCart(_index) {
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (confirm("Êtes-vous certain de vouloir supprimer ce produit de votre panier ?")) {
    if (_index > -1) {
      myCart.splice(_index, 1);
    }
    window.localStorage.removeItem("products");
    window.localStorage.setItem("products", JSON.stringify(myCart));
    updateQtyCart();
    displayCart();
  }
}

// FONCTION VIDER PANIER
function clearCart() {
  if (sizeCart() != 0) {
    if (confirm("Êtes-vous certain de vouloir vider le panier ?")) {
      window.localStorage.clear();
      updateQtyCart();
      displayCart();
    }
  }
}

// FONCTION TAILLE PANIER
function sizeCart() {
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  return myCart.length;
}

// FONCTION VERIFIER SI ELEMENT DEJA DANS PANIER
function checkIsInCart(_cart, _id, _qty, _color) {
  let valid = true;
  for (let ele of _cart) {
    if (ele.id == _id && ele.color == _color) {
      if (confirm("Cet article est déjà présent dans votre panier. Souhaitez-vous augmenter la quantité ?")) {
        ele.quantity += parseInt(_qty);
        window.localStorage.removeItem("products");
        window.localStorage.setItem("products", JSON.stringify(_cart)); 
        updateQtyCart();
        displayCart();
      }
      valid = false;
    }
  }
  return valid;
}


// --------------------- FONCTIONS INITIALISATION LOCALSTORAGE ----------------------------//

// LOCALSTORAGE INIT ET UPDATE AFFICHAGE ICONE PANIER
function updateQtyCart() {
  if (typeof(Storage) !== "undefined") { 
    // Initialise le panier en tant qu'item du localStorage
    if (window.localStorage.getItem("products") === null) {
      window.localStorage.setItem("products",JSON.stringify([]));
    }
    const displayQtyCart = document.getElementById("qtePanier");
    const myCart = JSON.parse(window.localStorage.getItem("products"));
    // Met à jour le chiffre sur l'icone panier du menu
    if (myCart.length == 0) {
      displayQtyCart.style.visibility = "hidden";
    } else {
      displayQtyCart.style.visibility = "visible";
      nbr = 0;
      for (let ele of myCart) {
        nbr += parseInt(ele.quantity);
      }
      displayQtyCart.innerHTML = nbr;
    }
  } else {
    console.log("error");
  }
}