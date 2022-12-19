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

        product.innerHTML += `
            <article>
              <div class="item__img">
                 <img src="${data.imageUrl}" alt="Photographie d'un canapé"> 
              </div>
              <div class="item__content">
  
                <div class="item__content__titlePrice">
                  <h1 id="title">${data.name}</h1>
                  <p>Prix : <span id="price">${data.price}</span>€</p>
                </div>
  
                <div class="item__content__description">
                  <p class="item__content__description__title">Description :</p>
                  <p id="description">${data.description}</p>
                </div>
  
                <div class="item__content__settings">
                  <div class="item__content__settings__color">
                    <label for="color-select">Choisir une couleur :</label>
                    <select name="color-select" id="colors">
                        <option value="">--SVP, choisissez une couleur --</option>
                        ${colorOptions}
  
                    </select>
                  </div>
  
                  <div class="item__content__settings__quantity">
                    <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                    <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                  </div>
                </div>
  
                <div class="item__content__addButton">
                  <button id="addToCart">Ajouter au panier</button>
                </div>
  
              </div>
            </article>
          `;
    }
    )