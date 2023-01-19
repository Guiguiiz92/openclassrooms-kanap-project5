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
            cart.products[indexToUpdate].quantity = quantity

            updateCart(false)
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