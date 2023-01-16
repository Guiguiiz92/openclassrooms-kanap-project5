let cart = {
    products: []
}
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

const cartItems = document.querySelector("#cart__items")
let globalQuantity = 0
let globalPrice = 0

updateCart()

// TODO : Récupérer les produits en panier du back et limiter le stockage du local storage à l'id et la quantité

/**
 * 
 * FONCTIONS
 * 
 */

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
    globalQuantity = 0
    globalPrice = 0
    cartItems.innerHTML = ""
    for (product of cart.products) {
        globalQuantity += product.quantity
        globalPrice += product.price * product.quantity

        cartItems.innerHTML += `
            <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${product.name}</h2>
                        <p>${product.color}</p>
                        <p>${product.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `
    }

    initEventListener()

    document.querySelector("#totalQuantity").innerHTML = globalQuantity
    document.querySelector("#totalPrice").innerHTML = globalPrice
}

function initEventListener() {
    document.querySelectorAll(".itemQuantity").forEach(item => {
        item.addEventListener("change", (e) => {
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            const quantity = parseInt(e.srcElement.value)

            let indexToUpdate = cart.products.findIndex((product) => product._id === productId)
            cart.products[indexToUpdate].quantity = quantity
            localStorage.setItem("cart", JSON.stringify(cart))

            globalQuantity = 0
            globalPrice = 0
            for (product of cart.products) {
                globalQuantity += product.quantity
                globalPrice += product.price * product.quantity
            }
            document.querySelector("#totalQuantity").innerHTML = globalQuantity
            document.querySelector("#totalPrice").innerHTML = globalPrice
        })
    })
    document.querySelectorAll(".deleteItem").forEach(item => {
        item.addEventListener("click", (e) => {
            const productId = e.srcElement.closest('.cart__item').getAttribute("data-id")
            cart.products = cart.products.filter((product) => product._id !== productId)

            updateCart()
        })
    })
}