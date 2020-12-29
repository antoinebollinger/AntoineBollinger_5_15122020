// AFFICHAGE PRODUIT SELECTIONNE
if (myId != "") {
  getOneProduct("prepend");
  getAllProducts({"nbMax": 3});
} else {
  window.location.href = "index.html";
}