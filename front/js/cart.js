let cart = {
    products: []
}
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

const cartItems = document.querySelector("#cart__items")
let globalQuantity = 0
let globalPrice = 0
for (product in cart.products) {
    globalQuantity += product.quantity
    globalPrice += product.price

    cartItems.innerHTML = `
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
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
    `
}

document.querySelector("#totalQuantity").innerHTML = globalQuantity
document.querySelector("#totalPrice").innerHTML = globalPrice