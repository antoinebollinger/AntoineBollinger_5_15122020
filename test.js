const nounourses = [{"colors":["Tan","Chocolate","Black","White"],"_id":"5be9c8541c9d440000665243","name":"Norbert","price":2900,"imageUrl":"http://localhost:3000/images/teddy_1.jpg","description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{"colors":["Pale brown","Dark brown","White"],"_id":"5beaa8bf1c9d440000a57d94","name":"Arnold","price":3900,"imageUrl":"http://localhost:3000/images/teddy_2.jpg","description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{"colors":["Brown"],"_id":"5beaaa8f1c9d440000a57d95","name":"Lenny and Carl","price":5900,"description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","imageUrl":"http://localhost:3000/images/teddy_3.jpg"},{"colors":["Brown","Blue","Pink"],"_id":"5beaabe91c9d440000a57d96","name":"Gustav","price":4500,"imageUrl":"http://localhost:3000/images/teddy_4.jpg","description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{"colors":["Beige","Tan","Chocolate"],"_id":"5beaacd41c9d440000a57d97","name":"Garfunkel","price":5500,"description":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.","imageUrl":"http://localhost:3000/images/teddy_5.jpg"}];

function afficherNomDesNounours(array) {
    for (let elem of array) {
        console.log(elem.name);
    }
}

afficherNomDesNounours(nounourses);

function afficherPrixTotal(array) {
    var total = 0;
    for (let elem of array) {
        total += elem.price;
    }
    console.log(total+" €"); 
}

afficherPrixTotal(nounourses);

// indiquer la remise en pourcent, ex. 20 pour -20%
function afficherPrixRemise(array,remise = 0) {
    for (let elem of array) {
        console.log(elem.name+" à -"+remise+"% revient à "+elem.price*((100 - remise)/100)+"€ (prix de base : "+elem.price+"€).");
    }
}

afficherPrixRemise(nounourses,50);

function afficherColorisDisponibles(array) {
    for (let elem of array) {
        console.log(elem.name+" est disponible en "+elem.colors.length+" couleur"+((elem.colors.length > 1) ? "s" : "")+" ("+elem.colors.join(', ')+").");
    }
}

afficherColorisDisponibles(nounourses);

function afficherSuperieurTrente(array) {
    for (let elem of array) {
        if (elem.price >= 3000) {
            console.log(elem.name+" coûte + de 3000€ (il coûte "+elem.price+"€).");
        } else {
            console.log(elem.name+" est adorable !");
        }
    }
}

afficherSuperieurTrente(nounourses);

function afficherSommeDescriptions(array) {
    total = "";
    for (let elem of array) {
        total += elem.description;
    }
    console.log(total);
}

afficherSommeDescriptions(nounourses);

function afficherTroisiemeCouleurDispo(array) {
    for (let elem of array) {
        if (elem.colors.length >= 3) {
            console.log("La troisième couleur de "+elem.name+" est "+elem.colors[2]+".");
        } else {
            console.log(elem.name+" n'a pas de troisième couleur.")
        }
    }
}

afficherTroisiemeCouleurDispo(nounourses);