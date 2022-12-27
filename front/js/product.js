//recupération de l'id depuis la page accueil de mon produit cliqué
let recupUrl = window.location.search;
// console.log(recupUrl);

//extraction de ?id= et de la string correspondant au produit afin de vérifier si l'id url correspond à _id plus tard
let url = new URLSearchParams(recupUrl).get('id');

fetch('http://localhost:3000/api/products')
    .then (function(response) {
        return response.json()
        .then (function(data) {
        //    console.log(data);
            for (let i = 0; i < data.length; i++) {
                
                if (url == data[i]._id) {

                    //affichage d'une image unique du produit
                    let recupClassImg = document.querySelector('.item__img');
                    let imgElem = document.createElement('img');
                    imgElem.src = data[i].imageUrl;
                    imgElem.alt = data[i].altTxt;
                    recupClassImg.appendChild(imgElem);
                    

                    //affichage du name unique du produit
                    let nomProduit = document.querySelector('#title');
                    let h1Title = document.createTextNode(data[i].name);
                    nomProduit.appendChild(h1Title);

                    
                    //affichage du prix unique du produit
                    let prixProduit = document.querySelector('#price');
                    let affichagePrixTxt = document.createTextNode(data[i].price);
                    prixProduit.appendChild(affichagePrixTxt);

                    
                    //affichage de la description unique du produit
                    let descriptionProduit = document.querySelector('#description');
                    let affichageDescription = document.createTextNode(data[i].description);
                    descriptionProduit.appendChild(affichageDescription);

                        //creation d'une deuxième boucle afin d'accéder à l'array colors
                        for (c = 0; c < data[i].colors.length; c++) {

                            //affichage des couleurs dans le select > option   
                            let selectProduit = document.querySelector('#colors');
                            let optionProduit = document.createElement('option');
                            optionProduit.value = data[i].colors[c];
                            let affichageTxtProduit = document.createTextNode(data[i].colors[c]);
                       
                            selectProduit.appendChild(optionProduit);
                            optionProduit.appendChild(affichageTxtProduit);
                        };
                    
                    //au clic sur le bouton 'ajouter au panier', redirection vers cart.html dans un nouvel onglet
                    let btnOnClick = document.querySelector('#addToCart');
                        btnOnClick.addEventListener('click', () => {
                            window.location.href = 'cart.html';
                            let select = document.querySelector('#colors');
                            let valueCart = select.options[select.selectedIndex].value; 
                            let idCart = data[i]._id;
                            let quantityCart = document.querySelector('#quantity').value;
                            let nameCart = data[i].name;
                            let priceCart = data[i].price;

                            /*condition pour vérifier si les couleurs et/ou la/les quantitées sont comprises entre 1-100
                            si vrai stockage des infos dans localstorage*/
                            if (valueCart == '' && quantityCart == 0) {
                                alert ('Veuillez choisir une couleur et renseigner une quantité !');
                            } else if (valueCart == '') {
                                alert('Veuillez choisir une couleur !');
                            } else if (quantityCart <= 0 || quantityCart >= 101) {
                                alert('Veuillez renseigner une quantité comprise entre 1 et 100 !');
                            } else {
                                //ajout du produit dans le tableau "dynamique" -> emptyArrayLs
                               if (localStorage.getItem('panier')) {
                                let emptyArrayLs = JSON.parse(localStorage.getItem('panier'));
                                
                                //produit sous forme d'objet avec id, name, quantité, color et prix
                                let arrayPanier = {
                                    id: idCart,
                                    name: nameCart,
                                    quantity: Number(quantityCart),
                                    color: valueCart,
                                    price: Number(priceCart)
                                };

                                let addNewItem = true;
                                for (let produit of emptyArrayLs) {
                                    if (arrayPanier.id == produit.id && arrayPanier.color == produit.color) {
                                        produit.quantity += arrayPanier.quantity;
                                        addNewItem = false;
                                    };
                                }
                                if (addNewItem == true){
                                    emptyArrayLs.push(arrayPanier);
                                };

                                let stringifyEmptyArray = localStorage.setItem('panier', JSON.stringify(emptyArrayLs));

                                } else {
                                //tableau vide par défaut
                                let emptyArrayLs = [];
                                
                                //produit sous forme d'objet
                                let arrayPanier = {
                                    id: idCart,
                                    name: nameCart,
                                    quantity: Number(quantityCart),
                                    color: valueCart,
                                    price: Number(priceCart)
                                };

                                let addNewItem = true;
                                for (let produit of emptyArrayLs) {
                                    if (arrayPanier.id == produit.id && arrayPanier.color == produit.color) {
                                        produit.quantity += arrayPanier.quantity;
                                        addNewItem = false;
                                    };
                                }
                                if (addNewItem == true){
                                    emptyArrayLs.push(arrayPanier);
                                };
                                 
                                let stringifyEmptyArray = localStorage.setItem('panier', JSON.stringify(emptyArrayLs));
                                }
                            }
                        }
                    );
                }
            }
        });
    }).catch(function (err) {
        //si api éteint ou refus de connexion une boîte de dialogue apparaît avec un message d'erreur
       alert('Erreur: ' + err);

        err = 'Oups... Veuillez réessayer plus tard !';
        let classTitles = document.querySelector('.titles');
        let pElemerr = document.createElement('p');
        let pTxt = document.createTextNode(err);

        classTitles.appendChild(pElemerr);
        pElemerr.appendChild(pTxt);

        document.querySelector('p').style.textAlign = 'center';
    });