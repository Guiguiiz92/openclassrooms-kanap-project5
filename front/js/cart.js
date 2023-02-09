let cart = {
    products: []
}
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

const cartItems = document.querySelector("#cart__items")
const url = "http://127.0.0.1:3000/api/products/"
let globalQuantity = 0
let globalPrice = 0

updateCart()

document.getElementsByClassName("cart__order__form")[0].addEventListener("submit", (event) => {
    event.preventDefault()
    let nbErrors = 0

    // Réinitialisation messages d'erreurs
    let firstNameError = document.getElementById("firstNameErrorMsg")
    let lastNameError = document.getElementById("lastNameErrorMsg")
    let addressError = document.getElementById("addressErrorMsg")
    let cityError = document.getElementById("cityErrorMsg")
    let emailError = document.getElementById("emailErrorMsg")
    firstNameError.innerHTML = ""
    lastNameError.innerHTML = ""
    addressError.innerHTML = ""
    cityError.innerHTML = ""
    emailError.innerHTML = ""

    // Contrôle du champ Prénom
    const firstName = document.getElementById("firstName").value
    if (firstName) {
        // Si le prénom ne match pas exactement avec la regex
        if (
            !firstName.match(/^[a-zA-Z -]+$/gm)
        ) {
            nbErrors++
            firstNameError.innerHTML = "Le format est incorrect. Seuls les lettres et le tiret sont autorisés."
        }

    } else {
        nbErrors++
        firstNameError.innerHTML = "Ce champ est obligatoire."
    }

    // Contrôle du champ Nom
    const lastName = document.getElementById("lastName").value
    if (lastName) {
        // Si le nom ne match pas exactement avec la regex
        if (!lastName.match(/^[a-zA-Z -']+$/gm)) {
            nbErrors++
            lastNameError.innerHTML = "Le format est incorrect. Seuls les lettres, le tiret et l'apostrophe sont autorisés."
        }
    } else {
        nbErrors++
        lastNameError.innerHTML = "Ce champ est obligatoire."
    }

    // Contrôle du champ Adresse
    const address = document.getElementById("address").value
    if (address) {
        // Si l'adresse ne match pas exactement avec la regex
        if (!address.match(/^[a-zA-Z0-9, -'.]+$/gm)) {
            nbErrors++
            addressError.innerHTML = "Le format de l'adresse est incorrecte."
        }
    } else {
        nbErrors++
        addressError.innerHTML = "Ce champ est obligatoire."
    }

    // Contrôle du champ Ville
    const city = document.getElementById("city").value
    if (city) {
        // Si la ville ne match pas exactement avec la regex
        if (!city.match(/^[a-zA-Z -']+$/gm)) {
            nbErrors++
            cityError.innerHTML = "Le format est incorrect. Seuls les lettres, le tiret et l'apostrophe sont autorisés."
        }
    } else {
        nbErrors++
        cityError.innerHTML = "Ce champ est obligatoire."
    }

    // Contrôle du champ Email
    const email = document.getElementById("email").value
    if (email) {
        // Si l'email ne match pas avec la regex
        if (!email.match(/^[a-zA-Z0-9.+-_]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,10}$/gm)) {
            nbErrors++
            emailError.innerHTML = "Le format d'adresse email est incorrect."
        }
    } else {
        nbErrors++
        emailError.innerHTML = "Ce champ est obligatoire."
    }

    if (nbErrors === 0) {
        const form = {
            firstName,
            lastName,
            address,
            city,
            email
        }
        // Possible déclaration d'objet plus verbeuse :
        // const form = {
        //     firstName: firstName,
        //     lastName: lastName,
        //     address: address,
        //     city: city,
        //     email: email
        // }
        sendCartAndForm(form)
    }
})

/**
 * 
 * FONCTIONS
 * 
 */

/**
 * Met à jour les élements du panier
 * @param updateDOM
 */
function updateCart(updateDOM = true) {
    // localStorage.setItem permet de mettre un élément dans le local storage
    // le local storage est un stockage clé => valeur dans le navigateur
    // ici la clé est "cart" et la valeur est JSON.stringify(cart)
    // JSON.stringify permet de transformer un objet JSON en chaîne de caractères
    // la valeur poussée dans le local storage est forcément une chaîne de caractères
    localStorage.setItem("cart", JSON.stringify(cart))
    globalQuantity = 0
    globalPrice = 0
    if (updateDOM) {
        //réinitialise l'affiche du panier
        cartItems.innerHTML = ""
    }
    // La fonction .map() permet de boucler sur chaque élément d'un tableau
    // Pour chaque élément on renvoie un nouvel état de l'élément
    // Ici on construit une liste de fetch (et donc de promesses)
    const promises = cart.products.map((tinyProduct) => {
        return fetch(url + tinyProduct._id)
            .then(response => response.json())
            .then((product) => {
                globalQuantity += tinyProduct.quantity
                globalPrice += product.price * tinyProduct.quantity

                if (updateDOM) {
                    // a += b ==> a = a + b
                    cartItems.innerHTML += `
                        <article class="cart__item" data-id="${product._id}" data-color="${tinyProduct.color}">
                            <div class="cart__item__img">
                                <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product.name}</h2>
                                    <p>${tinyProduct.color}</p>
                                    <p>${product.price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                        <p>Qté : </p>
                                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tinyProduct.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                        <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    `
                }
            })
    })
    //Promise.all effectue toutes les promesses précedemment crée
    Promise.all(promises).then(() => {
        if (updateDOM) {
            // Initialise les écouteurs d'évenements
            initEventListener()
        }

        document.querySelector("#totalQuantity").innerHTML = globalQuantity
        document.querySelector("#totalPrice").innerHTML = globalPrice
    })
}

/**
 * Ajoute des écouteurs d'évènements sur les inputs de quantité et les boutons de suppression du panier
 */
function initEventListener() {
    // Foreach execute une boucle sur les item
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        // Des qu'une valeur change, l'évenement est déclenché et donc execute le code
        item.addEventListener("change", (e) => {
            //Avec "Closest on va récuperer l'élément le plus proche qui a pour classe "cart__item" et avec get on récupere le data--id
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            const color = e.srcElement.closest('.cart__item').getAttribute("data-color")
            //parseInt = transforme en nombre entier
            const quantity = parseInt(e.srcElement.value)
            //Avec findIndex, je récupère l'index (sa position dans la liste) du produit qu'on va modifié
            let indexToUpdate = cart.products.findIndex((product) => product._id === productId && product.color === color)

            if (quantity > 0) {
                //Met à jour la nouvelle quantité du produit
                cart.products[indexToUpdate].quantity = quantity

                updateCart(false)
            } else {
                //Permet de repasser à la quantité initiale 
                e.srcElement.value = cart.products[indexToUpdate].quantity
                alert("La quantité ne peut pas être inférieure à 1.")
            }
        })
    })
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (e) => {
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            const color = e.srcElement.closest('.cart__item').getAttribute("data-color")
            //filter va vérif chaque item pour ma nouvelle liste "cart.products" sans l'item qu'on a voulu supprimer
            cart.products = cart.products.filter((product) => product._id !== productId || product.color !== color)

            updateCart()
        })
    })
}


/**
 * Récupère toutes les infos du panier et du formulaire pour l'envoyer au back
 * @param form
 */
function sendCartAndForm(form) {
    // .map permet de recréer un tableau avec une condition donnée
    // .map passe dans chaque élément du tableau nommé, ici cart.products
    // Ici, on recréé un tableau avec tous les product._id
    const idProducts = cart.products.map((product) => product._id)
    const body = {
        contact: form,
        products: idProducts
    }
    fetch(url + "order", {
        method: 'POST', // Méthode POST = envoyer des données dans le body de la requête
        headers: { // En-tête de la requête, là où on gère tous les "paramètres" de la requête
            'Content-Type': 'application/json' // Spécifier le type du contenu passer dans le body
        },
        body: JSON.stringify(body) // Corps de la requête (toutes les données que l'on souhaite passer)
    })
        // then = après
        .then(response => response.json())
        .then((data) => {
            // La requête est passée, on supprime le panier
            localStorage.removeItem('cart')

            window.location.href = "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + data.orderId
        })
        .catch((error) => {
            alert("La transaction n'a pas fonctionné, merci de réessayez ultérieurement.")
            console.log('error', error)
        })
}