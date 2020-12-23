// --------------------- FONCTIONS LOCALSTORAGE ----------------------------//

// LOCALSTORAGE INIT
updateNbrPanier();

if (typeof(Storage) !== "undefined") {
  updateNbrPanier();
} else {
  console.log("error");
}

// SWITCH ACTION
document.addEventListener("click", function(e) {
  if (e.target) {
    switch (e.target.id) {
      case "buttonAddToCart": 
        e.preventDefault();
        console.log("add to cart"+buttonAddToCart.dataset.id);
        addProdToCart(buttonAddToCart.dataset.id);
        break;
      case "clearCart":
        if (sizeCart() != 0) {
          if (confirm("Vous êtes certain de vouloir vider le panier ?")) {
            e.preventDefault();
            clearCart()
            updateNbrPanier();
          }
        }
        break;
    }
  }
});

// FONCTION AJOUT PRODUIT
function addProdToCart(id) {
  window.localStorage.setItem("newProduct",id);
  updateNbrPanier();
  alert("Votre article a bien été ajouté au panier.");
}

// FONCTION VIDER PANIER
function clearCart() {
  window.localStorage.clear();
  updateNbrPanier();
}

// FONCTION TAILLE PANIER
function sizeCart() {
  return window.localStorage.length;
}

// FONCTION VERIFIER SI ELEMENT DEJA DANS PANIER
function checkIsInCart(array, value) {


  
}
