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
        if (!matchExact(/[a-zA-Z -]/gm, firstName)) {
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
        if (!matchExact(/[a-zA-Z -']/gm, lastName)) {
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
        if (!matchExact(/[a-zA-Z0-9, -'.]/gm, address)) {
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
        if (!matchExact(/[a-zA-Z -']/gm, city)) {
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
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm)) {
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
    localStorage.setItem("cart", JSON.stringify(cart))
    globalQuantity = 0
    globalPrice = 0
    if (updateDOM) {
        cartItems.innerHTML = ""
    }
    const promises = cart.products.map((tinyProduct) => {
        return fetch(url + tinyProduct._id)
            .then(response => response.json())
            .then((product) => {
                globalQuantity += tinyProduct.quantity
                globalPrice += product.price * tinyProduct.quantity

                if (updateDOM) {
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
    Promise.all(promises).then(() => {
        if (updateDOM) {
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
    document.querySelectorAll(".itemQuantity").forEach((item) => {
        item.addEventListener("change", (e) => {
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            const color = e.srcElement.closest('.cart__item').getAttribute("data-color")
            const quantity = parseInt(e.srcElement.value)
            let indexToUpdate = cart.products.findIndex((product) => product._id === productId && product.color === color)

            if (quantity > 0) {
                cart.products[indexToUpdate].quantity = quantity

                updateCart(false)
            } else {
                e.srcElement.value = cart.products[indexToUpdate].quantity
                alert("La quantité ne peut pas être inférieure à 1.")
            }
        })
    })
    document.querySelectorAll(".deleteItem").forEach((item) => {
        item.addEventListener("click", (e) => {
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            const color = e.srcElement.closest('.cart__item').getAttribute("data-color")

            cart.products = cart.products.filter((product) => product._id !== productId || product.color !== color)

            updateCart()
        })
    })
}

/**
 * Renvoie un booléen si une chaîne de caractères (String) match exactement avec une Regex donnée
 * Exemple :
 *   /[a-zA-Z -]/gm
 *   "T1ot o-" 7
 *   ["T", "o", "t", " ", "o", "-"] 6
 * @param {RegExp} r 
 * @param {String} str 
 * @returns {Boolean}
 */
function matchExact(r, str) {
    var match = str.match(r);
    return match && str.length === match.length;
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
            // La requête est passée, on vide le panier
            cart = {
                products: []
            }
            updateCart()
            window.location.href = "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + data.orderId
        })
        .catch((error) => {
            alert("La transaction n'a pas fonctionné, merci de réessayez ultérieurement.")
            console.log('error', error)
        })
}