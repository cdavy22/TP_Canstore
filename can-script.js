// créer une variable pour stocker la 'base de données'
var products;

// utiliser fetch pour récupérer le JSON, et signaler toute erreur qui se produit dans l’opération fetch
fetch('produits.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
  }
});


function initialize() {
  // saisir les éléments d’interface que nous devons manipuler
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var nutriscore = document.querySelector('#nutriscore');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');
 
  // ils contiennent les résultats du filtrage par catégorie, et le terme de recherche
  var categoryGroup;
  var finalGroup; 
  var lastCategory = category.value;
  var lastSearch = '';
  
  // la base de données qui affiche tous les produits 
  finalGroup = products;
  updateDisplay();
  categoryGroup = [];
  finalGroup = [];
  searchBtn.onclick = selectCategory;

  // Fonction qui permet de selectionne une categorie de produits
  function selectCategory(e) {
    e.preventDefault();
    categoryGroup = [];
    finalGroup = [];
    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      // mettre à jour l’enregistrement de la dernière catégorie et du terme de recherche
      lastCategory = category.value;
      lastnutriscore = nutriscore.value
      lastSearch = searchTerm.value.trim();
      // sélectionner tous les produits, puis les filtrer par la recherche
      if (category.value === 'tous') {
        categoryGroup = products;
        selectProducts();
      } else {
        // effectuer des recherche avec des caractères en minuscules
        var lowerCaseType = category.value.toLowerCase();
        for (var i = 0; i < products.length; i++) {
          // Si la propriété de type d’un produit est la même que la catégorie choisie, nous voulons
          // l’afficher, donc on le pousse sur le tableau categoryGroup
          if (products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }
        //  le filtrage est terminé
        selectProducts();
      }
    }
  }
  function selectProducts() {
    // Si aucun terme de recherche n’a été saisi, il suffit de rendre le tableau finalGroup égal à la catégorieGroup
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      // Vérification des termes recherché celon la categorie
      for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].nom.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }
      updateDisplay();
    }

  }

  // processus de mise à jour de l’affichage
  function updateDisplay() {
    // supprimer le contenu précédent de l’élément
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // si aucun produit ne correspond au terme de recherche, afficher un message "Aucun résultat à afficher".
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        showProduct(finalGroup[i]);
      }
    }
  }

  // Afficher les produits dans l’élément 
  function showProduct(product) {
    // Creation des sections d'élément
    var url = 'images/' + product.image;
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');
    var txtnutriscore = document.createElement('h3');
    var nutriscore = document.createElement('span');
    // afficher l'icone de product correct
    section.setAttribute('class', product.type);

    // Remplacé par la majuscule le premier caractère
    heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());

    // Fixer le prix à 2 décimales
    para.textContent = '€' + product.prix.toFixed(2);

    // Définir la source de l’élément 
    image.src = url;
    image.alt = product.nom;
    
    // mise en couleur par apport au nutriscore 
    
    nutriscore.textContent = product.nutriscore
    if (nutriscore.textContent == 'A') {
      nutriscore.style.backgroundColor = '#196f3d'
    }

    else if (nutriscore.textContent == 'B') {
      nutriscore.style.backgroundColor = '#52be80'
    }

    else if (nutriscore.textContent == 'C') {
      nutriscore.style.backgroundColor = '#f1c40f'
    }

    else if (nutriscore.textContent == 'D') {
      nutriscore.style.backgroundColor = '#dc7633'
    }

    else if (nutriscore.textContent == 'E') {
      nutriscore.style.backgroundColor = '#c0392b'
    }


    txtnutriscore.textContent = 'nutriscore :'

    // Ajouter les éléments au DOM, pour ajouter le produit à l’interface utilisateur
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
    section.appendChild(txtnutriscore);
    txtnutriscore.appendChild(nutriscore);
  }
}
