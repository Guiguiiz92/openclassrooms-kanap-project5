const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const url = "http://127.0.0.1:3000/api/products/" + urlParams.get("id");

let product = document.querySelector(".item")
fetch(url)
  .then(response => response.json())
  .then(function (data) {
    let colorOptions
    for (let color of data.colors) {
      colorOptions += `<option value="${color}">${color}</option>`
    }
    document.querySelector(".item__img").innerHTML = `<img src="${data.imageUrl}" alt="Photographie d'un canapé">`
    document.querySelector("#title").innerHTML = data.name
    document.querySelector("#price").innerHTML = data.price
    document.querySelector("#description").innerHTML = data.description
    document.querySelector("#colors").innerHTML += colorOptions

    // Ajouter un produit
    document.getElementById("addToCart").addEventListener("click", () => {
      const color = document.querySelector("#colors").value
      if (color) {
        const quantity = parseInt(document.querySelector("#quantity").value)
        if (quantity > 0) {
          let cart = {
            products: []
          }
          // Si le panier existe dans le localStroage on le récupère
          if (localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
          }
          // Avec findIndex on boucle sur chaque product et s'il remplit la condition donné 
          // on renvoie son index dans la liste cart.products
          // Pour identifier un product on check la combinaison de condition id et color
          let index = cart.products.findIndex(product => product._id === data._id && product.color === color)
          if (index >= 0) {
            // Si l'index est bien retrouvé, ça signifie que le product existe déjà
            // donc on le récupère et on met à jour sa quantité
            cart.products[index].quantity += quantity
          } else {
            // Sinon on ajoute le product entier dans le panier
            const product = {
              _id: data._id,
              quantity,
              color
            }
            cart.products.push(product)
          }

          localStorage.setItem("cart", JSON.stringify(cart))
          alert("Produit ajouté !");
        } else {
          alert("La quantité ne peut pas être inférieure à 1.")
        }
      } else {
        alert("La couleur est obligatoire.")
      }
    })
  })
