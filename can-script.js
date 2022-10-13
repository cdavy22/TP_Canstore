// créer une variable pour stocker la 'base de données'
var products;

// utiliser fetch pour récupérer le JSON, et signaler toute erreur qui se produit dans l’opération fetch
fetch('products.json').then(function (response) {
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
      lastSearch = searchTerm.value.trim();
      // sélectionner tous les produits, puis les filtrer par la recherche
      if (category.value === 'All') {
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
        if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
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
        fetchBlob(finalGroup[i]);
      }
    }
  }

  // fetch pour récupérer l’image des produits,
  function fetchBlob(product) {
    // construire le chemin URL des images à partir de la propriété product.image
    var url = 'images/' + product.image;
    fetch(url).then(function (response) {
      if (response.ok) {
        //une URL interne temporaire en convertisant le blob
        response.blob().then(function (blob) {
          var objectURL = URL.createObjectURL(blob);
          showProduct(objectURL, product);
        });
      } else {
        console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
      }
    });
  }

  // Afficher les produits dans l’élément 
  function showProduct(objectURL, product) {
    // Creation des sections d'élément
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');

    // afficher l'icone de produit correct
    section.setAttribute('class', product.type);

    // Remplacé par la majuscule le premier caractère
    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    // Fixer le prix à 2 décimales
    para.textContent = '$' + product.price.toFixed(2);

    // Définir la source de l’élément 
    image.src = objectURL;
    image.alt = product.name;

    // Ajouter les éléments au DOM, pour ajouter le produit à l’interface utilisateur
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
