// AFFICHAGE PRODUIT SELECTIONNE
if (myId != "") {
  getOneProduct("prepend");
  getAllProducts(3);
} else {
  window.location.href = "index.html";
}