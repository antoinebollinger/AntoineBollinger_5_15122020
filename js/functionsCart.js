// INITIALISATION PANIER
initializeCart();

// SWITCH ACTION SELON DATA-ACTION
document.addEventListener("click", function(e) {
  if (e.target) {
    switch (e.target.dataset.action) {
      case "addToCart": 
        e.preventDefault();
        const myColor = document.getElementById("selectColor");
        const myQty = document.getElementById("inputQty");
        addToCart({"id": e.target.dataset.id, "quantity": parseInt(myQty.value), "color": myColor.value, "price": e.target.dataset.price})
        break;
      case "refreshCart":
        e.preventDefault();
        const myIndex = e.target.dataset.index;
        const myNewQty = document.getElementById("quantite_"+myIndex);
        refreshCart({"index": myIndex, "quantity": myNewQty.value});
        break;
      case "removeFromCart": 
        e.preventDefault();
        removeFromCart(e.target.dataset.index);
        break;
      case "clearCart":
        e.preventDefault();
        clearCart({"confirm": true});
        break;
      case "checkoutCart":
        // VOIR FONCTION SUR functions.js, ligne 43
        break;
    }
  }
});

// ECOUTEUR SUPPLEMENTAIRE SUR CHANGEMENT QUANTITE PRODUIT DANS PANIER
document.addEventListener("change", function(e) {
  if (e.target.classList.contains("qty")) {
    refreshCart({"index": e.target.dataset.index, "quantity": e.target.value});
  }
})


// --------------------- FONCTIONS DE BASE PANIER -------------------------//

// FONCTION AJOUT PRODUIT
function addToCart(object) {
  // L'argument object doit contenir : {id, quantity, color, price}
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (checkIsInCart(myCart, {"id": object.id, "quantity": object.quantity, "color": object.color})) {
    myCart.push(object);
    updateCart(myCart,  {"clear": false});
    divLatH2.innerHTML = "Votre nounours a bien été ajouté au panier.";
    divLateral.classList.add("active");
  }
}

// FONCTION MISE A JOUR PANIER 
function refreshCart(object) {
  // l'argument object doit contenir {index, quantity}
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  for (let ele of myCart) {
    if (myCart.indexOf(ele) == object.index) {
      ele.quantity = parseInt(object.quantity);
    }
  }
  updateCart(myCart,  {"clear": false});
}

// FONCTION SUPPRIMER PRODUIT
function removeFromCart(index) {
  // Supprime l'élément ayant l'index en argument
  let myCart = JSON.parse(window.localStorage.getItem("products"));
  if (confirm("Êtes-vous certain de vouloir supprimer ce produit de votre panier ?")) {
    if (index > -1) {
      myCart.splice(index, 1);
    }
    updateCart(myCart, {"clear": false});
  }
}

// FONCTION VIDER PANIER
function clearCart(options) {
  // Supprime le panier si existe. OPTIONS : confirm = true => demander confirmation, sinon non.
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  if (myCart.length != 0) {
    if (options.confirm) {
      if (confirm("Êtes-vous certain de vouloir vider le panier ?")) {
        updateCart("", {"clear": true});
      }
    } else {
      updateCart("", {"clear": true});
    }
  }
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
function checkIsInCart(array, object) {
  // L'argument array correspond au panier (myCart)
  // L'argument object doit contenir {id, quantity, color}
  let valid = true;
  for (let ele of array) {
    if (ele.id == object.id && ele.color == object.color) {
      if (confirm("Cet article est déjà présent dans votre panier. Souhaitez-vous augmenter la quantité ?")) {
        ele.quantity += parseInt(object.quantity);
        updateCart(array, {"clear": false});
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
  let products = [];
  for (let ele of myCart) {
    products.push(ele.id);
  }
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;
  let contact = {"firstName": firstName, "lastName": lastName, "address": address, "city": city, "email": email};
  let order = {"products": products, "contact": contact};
  sendOrder(order);
}

async function sendOrder(array) {
  // L'argument array doit contenir : {"products": ["id1", "id2", etc], "contact": {"firstName": "prénom", "lastName": "nom", "address": "adresse", "city": "ville", "email": "email"}}
  await fetch(apiUrl+"order", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(array)})
    .then((response) => response.json())
    .then((response) => getConfirm(response))
}

function getConfirm(array) {
  clearCart({"confirm": false});
  window.localStorage.setItem("checkout",JSON.stringify(array));
  console.log(array);
  //window.location.href = "confirmation.html";
}

// FONCTION CONFIRMATION
function displayConfirm(array) {
  const confirmDiv = document.querySelector(".jumbotron");
    createEle("h2", "", "", "", "Merci pour votre commande !", confirmDiv);
    createEle("p", "", "", "", "Cher "+array.contact.firstName+",<br>nous avons le plaisir de vous confirmer que votre commande a bien été prise en compte.", confirmDiv);
    createEle("p", "", "", "", "N° de commande :", confirmDiv);
    createEle("h3", "", "", "", array.orderId+"<br>", confirmDiv);
    createEle("p", "", "", "", "<br>Vos coordonnées :", confirmDiv);
    createEle("h4", "", "", "", array.contact.firstName+" "+array.contact.lastName, confirmDiv);
    createEle("p", "", "", "", array.contact.address+"<br>"+array.contact.city,confirmDiv);
    createEle("p", "", "", "", array.contact.email, confirmDiv);
    createEle("p", "", "", "", "<br>Récapitulatif de votre commande :", confirmDiv);
    const confirmUl = createEle("ul", "", ["ul-confirm", "bg-secondary", "text-body"], "", "", confirmDiv);
      for (let ele of array.products) {
        createEle("li", "", "", {"style": "background-image:url('"+ele.imageUrl+"');"}, "<span class=\"font-weight-bold\">"+ele.name+"</span>", confirmUl);
      }
}

// --------------------- FONCTIONS AFFICHAGE PANIER --------------------------------//

function displayCart() {
  cartDiv.innerHTML = "";
  const myCart = JSON.parse(window.localStorage.getItem("products"));
  for (let ele of myCart) {
    displayProduct(ele, myCart.indexOf(ele));
  }
  const totalCartDiv = document.getElementById("totalCart");
  const mytotalCart = totalCart();
  totalCartDiv.innerHTML = displayPrice(mytotalCart);
}

async function displayProduct(array, index) {
  await fetch(apiUrl+array.id)
    .then((response) => response.json())
    .then((nounours) => createItem(nounours, index, array.color, array.quantity))
}

function createItem(array, _index, _color, _quantity) {
  const newProduct = createEle("div", "", ["row", "py-4", "cart-product"], "", "", cartDiv);
  //Image
    const newDivImg = createEle("div", "", ["col-2", "text-center"], "", "", newProduct);
      createEle("img", "", ["img-responsive"], {"src": array.imageUrl, "alt": "preview", "width": 120, "height": 80}, "", newDivImg);
    // Product Infos 
    const newDivInfo = createEle("div", "", ["col-5", "text-left"], "", "", newProduct);
      createEle("h2", "", ["product-name"], "", "<a href=\"product.html?myId="+array._id+"\">"+array.name+"</a>", newDivInfo);
      createEle("p", "", "", "", "Couleur : "+_color, newDivInfo);
    // Prix / Quantité, Supprimer
    const newProductSub = createEle("div", "", ["col-5", "row"], "", "", newProduct);
    // Prix
      const newDivPrix = createEle("div", "", ["col", "text-right"], {"style": "padding-top:5px"}, "", newProductSub);
        createEle("h2", "", "", "", displayPrice(array.price / 100)+"&nbsp;<span class=\"text-muted\">x</span>&nbsp;", newDivPrix);
      // Quantité
      const newDivQte = createEle("div", "", ["col"], "", "", newProductSub);
        //const newDivQteSub = createEle("div", "", ["quantity"], "", "", newDivQte);
        createEle("input", "quantite_"+_index, ["qty", "form-control"], {"type": "number", "value": _quantity, "step": 1, "min": 1, "title": "Qty", "size": 4, "data-index": _index}, "", newDivQte);
      const newDivActualiser = createEle("div", "", ["col", "text-right"], "", "", newProductSub);
        createEle("button", "", ["btn", "btn-primary", "a-refresh"], {"data-index": _index, "data-action": "refreshCart", "title": "Actualiser le panier"}, "<i class=\"fas fa-sync-alt\"></i>", newDivActualiser);          
      const newDivSupprimer = createEle("div", "", ["col", "text-right"], "", "", newProductSub);
        createEle("button", "", ["btn", "btn-primary"], {"data-index": _index, "data-action": "removeFromCart", "title": "Supprimer ce produit"}, "<i class=\"fa fa-trash\"></i>", newDivSupprimer);
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
      const mustHide = document.querySelectorAll(".mustHide");
      for (let ele of mustHide) {
        ele.style.visibility = (displayTotal) ? "visible" : "hidden";
      }
      const mustShow = document.querySelectorAll(".mustShow");
      for (let ele of mustShow) {
        ele.style.visibility = (displayTotal) ? "hidden" : "visible";
      }
    }
  } else {
    // Affiche un message d'erreur si localStorage pas dispo
    createEle("p", "", "", "", "Erreur : impossible d'initialiser le panier. Veuillez essayer ultérieurement. Si le problème persiste, merci de contacter l'administrateur du site.", mainDiv);
  }
}

function updateCart(array,options) {
  window.localStorage.removeItem("products");
  if (!options.clear) {
    window.localStorage.setItem("products", JSON.stringify(array.sort()));   
  }
  initializeCart();
  if (currentUrl == "panier.html") {
    displayCart();
  }
}