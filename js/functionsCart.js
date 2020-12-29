// SWITCH ACTION
document.addEventListener("click", function(e) {
  if (e.target) {
    switch (e.target.dataset.action) {
      case "addToCart": 
        e.preventDefault();
        const myColor = document.getElementById("selectColor");
        const myQty = document.getElementById("inputQty");
        addToCart(e.target.dataset.id, parseInt(myQty.value), myColor.value, e.target.dataset.price);
        break;
      case "refreshCart":
        e.preventDefault();
        const myIndex = e.target.dataset.index;
        const myNewQty = document.getElementById("quantite_"+myIndex);
        refreshCart(myIndex, myNewQty.value);
        break;
      case "removeFromCart": 
        e.preventDefault();
        removeFromCart(e.target.dataset.index);
        break;
      case "clearCart":
        e.preventDefault();
        clearCart();
        break;
      case "checkoutCart":
        checkoutCart();
        break;
    }
  }
});

document.addEventListener("change", function(e) {
  refreshCart(e.target.dataset.index, e.target.value);
})

const cartDiv = document.getElementById("cartDiv");

initializeCart();
displayCart();


// --------------------- FONCTIONS DE BASE PANIER -------------------------//

// FONCTION AJOUT PRODUIT
function addToCart(_id, _qty, _color, _price) {
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (checkIsInCart(myCart, _id, _qty, _color)) {
    const newProduct = {"id": _id, "color": _color, "quantity" : _qty, "price": _price};
    myCart.push(newProduct);
    updateCart(myCart,  {"clear": false});
    divLatH2.innerHTML = "Votre nounours a bien été ajouté au panier.";
    divLateral.classList.add("active");
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
  updateCart(myCart,  {"clear": false});
}

// FONCTION SUPPRIMER PRODUIT
function removeFromCart(_index) {
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (confirm("Êtes-vous certain de vouloir supprimer ce produit de votre panier ?")) {
    if (_index > -1) {
      myCart.splice(_index, 1);
    }
    updateCart(myCart, {"clear": false});
  }
}

// FONCTION VIDER PANIER
function clearCart() {
  if (sizeCart() != 0) {
    if (confirm("Êtes-vous certain de vouloir vider le panier ?")) {
      updateCart("", {"clear": true});
    }
  }
}

// FONCTION TAILLE PANIER
function sizeCart() {
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  return myCart.length;
}

// FONCTION PRIX TOTAL 
function totalCart() {
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  let total = 0;
  for (let ele of myCart) {
    total += parseInt(ele.quantity) * parseFloat(ele.price / 100);
  }
  return(total);
}

// FONCTION VERIFIER SI ELEMENT DEJA DANS PANIER
function checkIsInCart(_cart, _id, _qty, _color) {
  let valid = true;
  for (let ele of _cart) {
    if (ele.id == _id && ele.color == _color) {
      if (confirm("Cet article est déjà présent dans votre panier. Souhaitez-vous augmenter la quantité ?")) {
        ele.quantity += parseInt(_qty);
        updateCart(_cart, {"clear": false});
        divLatH2.innerHTML = "Votre nounours a bien été ajouté au panier.";
        divLateral.classList.add("active");
      }
      valid = false;
    }
  }
  return valid;
}

// FONCTION COMMANDE 
function checkoutCart() {
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  console.log("on commande ça :");
  console.log(myCart);
}

// --------------------- FONCTIONS AFFICHAGE PANIER --------------------------------//

function displayCart() {
  if (currentUrl == "panier.html") {
    initializeCart();
    cartDiv.innerHTML = "";
    const myCart = JSON.parse(window.localStorage.getItem("products"));
    for (let ele of myCart) {
      displayProduct(ele, myCart.indexOf(ele));
    }
    //createEle("div", "", "", "", JSON.stringify(myCart), cartDiv);
    const totalCartDiv = document.getElementById("totalCart");
    const mytotalCart = totalCart();
    totalCartDiv.innerHTML = displayPrice(mytotalCart);
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
    const newDivImg = createEle("div", "", ["col-2", "col-sm-2", "col-md-2", "text-center"], "", "", newProduct);
      createEle("img", "", ["img-responsive"], {"src": array.imageUrl, "alt": "preview", "width": 120, "height": 80}, "", newDivImg);
    // Product Infos 
    const newDivInfo = createEle("div", "", ["col-5", "col-sm-5", "col-md-5", "text-sm-center", "text-md-left"], "", "", newProduct);
      createEle("h2", "", ["product-name"], "", "<a href=\"product.html?myId="+array._id+"\">"+array.name+"</a>", newDivInfo);
      createEle("p", "", "", "", "Couleur : "+_color, newDivInfo);
    // Prix / Quantité, Supprimer
    const newProductSub = createEle("div", "", ["col-5", "col-sm-5", "col-md-5", "text-sm-center", "text-md-right", "row"], "", "", newProduct);
    // Prix
      const newDivPrix = createEle("div", "", ["col", "col-sm", "col-md", "text-md-right"], {"style": "padding-top:5px"}, "", newProductSub);
        createEle("h2", "", "", "", displayPrice(array.price / 100)+"&nbsp;<span class=\"text-muted\">x</span>&nbsp;", newDivPrix);
      // Quantité
      const newDivQte = createEle("div", "", ["col", "col-sm", "col-md"], "", "", newProductSub);
        const newDivQteSub = createEle("div", "", ["quantity"], "", "", newDivQte);
          createEle("input", "quantite_"+_index, ["qty"], {"type": "number", "value": _quantity, "step": 1, "min": 1, "title": "Qty", "size": 4, "data-index": _index}, "", newDivQteSub);
      const newDivActualiser = createEle("div", "", ["col", "col-sm", "col-md", "text-right"], "", "", newProductSub);
        createEle("a", "", ["btn", "btn-primary", "a-refresh"], {"href": "#", "data-index": _index, "data-action": "refreshCart", "title": "Actualiser le panier"}, "<i class=\"fas fa-sync-alt\"></i>", newDivActualiser);          
      const newDivSupprimer = createEle("div", "", ["col", "col-sm", "col-md", "text-right"], "", "", newProductSub);
        createEle("a", "", ["btn", "btn-primary"], {"href": "#", "data-index": _index, "data-action": "removeFromCart", "title": "Supprimer ce produit"}, "<i class=\"fa fa-trash\"></i>", newDivSupprimer);
}


// --------------------- FONCTIONS INITIALISATION ET UPDATE LOCALSTORAGE ----------------------------//

// LOCALSTORAGE INIT ET UPDATE AFFICHAGE ICONE PANIER
function initializeCart() {
  if (typeof(Storage) !== "undefined") { 
    // Initialise le panier en tant qu'item du localStorage
    if (window.localStorage.getItem("products") === null) {
      window.localStorage.setItem("products",JSON.stringify([]));
    }
    const displayQtyCart = document.getElementById("qtePanier");
    const myCart = JSON.parse(window.localStorage.getItem("products"));
    // Met à jour le chiffre sur l'icone panier du menu
    let displayTotal = false;
    if (myCart.length == 0) {
      displayQtyCart.style.visibility = "hidden";
    } else {
      displayQtyCart.style.visibility = "visible";
      nbr = 0;
      for (let ele of myCart) {
        nbr += parseInt(ele.quantity);
      }
      displayQtyCart.innerHTML = nbr;
      displayTotal = true;
    }
    // Affiche ou masque le total sur le panier, selon qu'il soit à zero.
    if (currentUrl == "panier.html") {
      const displayTotalCart = document.getElementById("div-total");
      const buttonCheckout = document.getElementById("checkoutCart");
      if (displayTotal) {
        displayTotalCart.style.visibility = "visible";
        buttonCheckout.classList.remove("disabled");
      } else {
        displayTotalCart.style.visibility = "hidden";
        buttonCheckout.classList.add("disabled");
      }
    }
  } else {
    // Le panier ne s'affiche pas
    console.log("error");
  }
}

function updateCart(array,options) {
  if (options.clear) {
    window.localStorage.clear();
  } else {
    window.localStorage.removeItem("products");
    window.localStorage.setItem("products", JSON.stringify(array.sort()));   
  }
  initializeCart();
  displayCart();
}