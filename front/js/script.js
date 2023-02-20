const url = "http://localhost:3000/api/products";

let articles = document.querySelector("#items")
fetch(url)
  .then(response => response.json())
  .then(data => {
    for (let canape of data) {
      articles.innerHTML += ` <a href="./product.html?id=${canape._id}">
            <article>
              <img src="${canape.imageUrl}" alt="${canape.altTxt}">
              <h3 class="productName">${canape.name}</h3>
              <p class="productDescription">${canape.description}</p>
            </article>
          </a>
            `;
    }
  })
