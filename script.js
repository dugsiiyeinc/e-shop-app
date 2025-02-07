const API_URL = "https://fakestoreapi.com";
fetchProducts();
fetchCategories();
countItemsInTheCart();
let productsGrid = document.querySelector("#productsGrid");
let categoryFilter = document.querySelector("#categoryFilter");
let currentProducts = [];
async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    let data = await response.json();
    renderProducts(data);
  } catch (error) {
    console.log(error);
  }
}

function renderProducts(products) {
  currentProducts = products;

  const newProducts = products
    .map(({ title, price, image, category, id }) => {
      return `<div class="product-card">
      <img src="${image}" alt="${title}" class="product-image">
      <div class="product-info">
        <h3>${title}</h3>
        <p class="product-price">$${price.toFixed(2)}</p>
        <p class="product-category">${category}</p>
        <button class="add-to-cart-btn" data-id="${id}">
          Add to Cart
        </button>
      </div>
    </div>`;
    })
    .join("");
  productsGrid.innerHTML = newProducts;

  productsGrid.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { id } = button.dataset;
      let product = currentProducts.find((product) => product.id == id);
      // product.quantity = 1;
      addToCart(product);
    });
  });
}

function fetchCategories() {
  fetch(`${API_URL}/products/categories`)
    .then((response) => response.json())
    .then((data) => renderCaqtegories(data))
    .catch((error) => console.log(error));
}

function renderCaqtegories(categories) {
  categoryFilter.innerHTML += categories.map(
    (category) =>
      `<option value="${category}">${
        category[0].toUpperCase() + category.slice(1)
      }</option>`
  );
}

let cartBtn = document.querySelector("#cartBtn");
let cartModel = document.querySelector("#cartModal");
let cartItems = document.querySelector("#cartItems");
let closeCartModel = document.querySelector("#closeCartModal");

cartBtn.addEventListener("click", () => {
  cartModel.classList.add("active");
  renderCart();
});

closeCartModel.addEventListener("click", () => {
  cartModel.classList.remove("active");
});
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cartItems.innerHTML = cart
    .map(
      (item) => `

    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button class="quantity-btn" data-id="${
          item.id
        }" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" data-id="${
          item.id
        }" data-action="increase">+</button>
      </div>
    </div>
  `
    )
    .join("");

  cartItems.querySelectorAll(".quantity-btn").forEach((quantityBtn) => {
    quantityBtn.addEventListener("click", () => {
      // const id = quantityBtn.dataset.id;
      // const action = quantityBtn.dataset.action;
      const { id, action } = quantityBtn.dataset;

      let cartItem = cart.find((crt) => crt.id == id);

      if (action == "increase") {
        cartItem.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      } else if (action == "decrease") {
        cartItem.quantity -= 1;
        if (cartItem.quantity === 0) {
          cart = cart.filter((crt) => crt.id != id);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      countItemsInTheCart();
      renderCart();
    });
  });
}

function addToCart(item) {
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  let existItem = carts.find((cart) => cart.id == item.id);

  if (existItem) {
    existItem.quantity += 1;
  } else {
    carts.push({ ...item, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(carts));
  countItemsInTheCart();
}

function countItemsInTheCart() {
  let cartCount = document.querySelector("#cartCount");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCount.textContent = cart.length;
  calculateCartItems();
}

function calculateCartItems() {
  let cartTotal = document.querySelector("#cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  cartTotal.textContent = total.toFixed(2);
}
