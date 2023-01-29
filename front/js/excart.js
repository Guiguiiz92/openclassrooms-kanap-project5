
let cart = JSON.parse(localStorage.getItem("cart"))
cart.products.map((tinyProduct) => {
    fetch("http://127.0.0.1:3000/api/products/" + tinyProduct._id)
        .then(response => response.json())
        .then((product) => {
            /* globalQuantity += tinyProduct.quantity
             globalPrice += product.price * tinyProduct.quantity*/
            const cartItems = document.querySelector("#cart__items")


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

        })
})
