//premier affichage
addDonnee();
document.forms[0].categorie.addEventListener("change", function() {
  addDonnee();
});
document.forms[0].nutri.addEventListener("change", function() {
    addDonnee();
});
document.forms[0].searchTerm.addEventListener("keypress", function(e) {
  if (e.keyCode === 13) {
    e.preventDefault()
    addDonnee();
  }     
});

//sur le click
document.getElementById("btnReset").addEventListener('click', function (event) {
    event.preventDefault();
    document.forms[0].reset()
    addDonnee();
  });

//recup données
function addDonnee() {  
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        triage(json);//lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}
//L'autocomplexion 
function autocompleteMatch(event) {
  var input = event.target;//recuperation de l'element input
  var saisie = input.value;//recuperation de la saisie
  var min_characters = 1;// minimum de caractères de la saisie
  if (!isNaN(saisie) || saisie.length < min_characters ) { 
    return [];
  }
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        traiterReponse(json,saisie);
       //lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

function traiterReponse(data,saisie)
{
var listeValeurs = document.getElementById('listeValeurs');
listeValeurs.innerHTML = "";//mise à blanc des options
var reg = new RegExp(saisie, "i");//Ajout de la condition "i" sur le regexp 
let terms = data.filter(term => term.nom.match(reg));//recup des termes qui match avec la saisie
    for (i=0; i<terms.length; i++) {//création des options
      var option = document.createElement('option');
                  option.value = terms[i].nom;
                  listeValeurs.appendChild(option);
}
  }

//triage
function triage(products) {
  var valeur = { 0: "tous", 1: "legumes", 2: "soupe", 3: "viande" }
  var type = valeur[document.forms[0].categorie.value];
  var nutri = document.forms[0].nutri.value;
  var lowerCaseSearchTerm = document.querySelector('#searchTerm').value.trim().toLowerCase();

  var finalGroup = [];

  products.forEach(product => {
    if (product.type === type || type === 'tous') {//sur la categorie
      if (product.nutriscore === nutri || nutri === '0') {//sur le nutri
        if (product.nom.toLowerCase().indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {//sur le searchterm
          finalGroup.push(product);
        }
      }
    }
  });

  showProduct(finalGroup);
}

//Affichage Aléatoire des produit 
function shuffleArray(inputArray){
  inputArray.sort(()=> Math.random() - 0.5);
}

//Affichage
function showProduct(finalGroup) {
  shuffleArray(finalGroup);
  var main = document.querySelector('main');

  //vidage
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  // affichage produits
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'Aucun résultats';
    main.appendChild(para);
  }

  else {
    finalGroup.forEach(product => {;
      var section = document.createElement('div');
      section.setAttribute('class', product.type);
      section.classList.add("card");
      section.classList.add("d-grid");      
      section.classList.add("text-center");
      section.classList.add("border-success");
      section.classList.add("mb-4", "card");
      var bouton = document.createElement('button');
      bouton.setAttribute('class', product.type);
      bouton.setAttribute("onclick","Acheter()");
      bouton.classList.add("btn");
      bouton.classList.add("btn-outline-success");
      bouton.classList.add("btn-lg");
      bouton.textContent = "Acheter";
      var heading = document.createElement('div');
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      heading.className = 'card-title'; 
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted'; 
      var para = document.createElement('p');
      para.textContent = product.prix.toFixed(2) +"€";
      var nutri = document.createElement('span');
      nutri.textContent = product.nutriscore;
      var image = document.createElement('img');
      image.className = 'card-img-top'; 
      image.src = "images/" + product.image;
      image.alt = product.nom;
      var panier = document.createElement('div');
      var image2 = document.createElement('img');
      image2.src = "icons/painier.png";
      image2.width="50";
      image2.height="50";
      var option = document.createElement('option');
      option.value = nutri;
      option.value = section;
      listeValeurs.appendChild(option);

      section.appendChild(heading);
      section.appendChild(foot);
      section.appendChild(bouton);
      section.appendChild(panier);
      section.appendChild(image);
      foot.appendChild(para);
      foot.appendChild(nutri);
      main.appendChild(section);
      panier.appendChild(image2);
      
    });
  }
}

//remplir le panier
var nbProduits = 0
var panier = document.getElementById('panier')
panier.innerHTML = (nbProduits);
function Acheter(){
  nbProduits += 1;
  panier.innerHTML = "";
  panier.innerHTML = nbProduits;
}
function videPanier(){
  nbProduits = 0
  panier.innerText = (nbProduits);
} 