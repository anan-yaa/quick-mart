const bootstrapScript = document.createElement("script");
bootstrapScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js";
document.head.appendChild(bootstrapScript);
import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const products = [
  {
    id: 1,
    name: "Fresh Apples (1kg)",
    price: 99,
    image: "../assets/images/apples.webp",
    category: "Fruits",
  },
  {
    id: 2,
    name: "Bananas - 1 Dozen",
    price: 79,
    image: "../assets/images/bananas.avif",
    category: "Fruits",
  },
  {
    id: 3,
    name: "Cow Milk - 1L",
    price: 59,
    image: "../assets/images/milk.avif",
    category: "Dairy",
  },
  {
    id: 4,
    name: "Fresh Bread Loaf",
    price: 49,
    image: "../assets/images/bread.jpg",
    category: "Bakery",
  },
  {
    id: 5,
    name: "Eggs - 1 Dozen",
    price: 99,
    image: "../assets/images/eggs.avif",
    category: "Dairy",
  },
  {
    id: 6,
    name: "Chicken Breast Boneless, 1kg",
    price: 399,
    image: "../assets/images/chicken.jpeg",
    category: "Meat",
  },
];

let cart = JSON.parse(localStorage.getItem("quickmart-cart")) || [];

function renderProducts() {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.className = "col-md-4 mb-4";
    productDiv.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
                <h5>${product.name}</h5>
                <p>₹${product.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="decrease-btn" data-product-id="${
                      product.id
                    }">-</button>
                    <input type="text" id="quantity-${product.id}" value="0" 
                           style="width:50px; text-align:center;" readonly>
                    <button class="increase-btn" data-product-id="${
                      product.id
                    }">+</button>
                </div>
                <button class="add-to-cart-btn btn btn-primary mt-2" 
                        data-product-id="${product.id}">Add to Cart</button>
            </div>
        `;
    container.appendChild(productDiv);
  });
  addEventListeners();
}

function addEventListeners() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId);
    });
  });
  // increase qty buttons
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.productId);
      increaseQuantity(productId);
    });
  });
  // decr qty buttons
  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.dataset.productId);
      decreaseQuantity(productId);
    });
  });
}

function increaseQuantity(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function decreaseQuantity(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  if (parseInt(quantityInput.value) > 0) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}

function addToCart(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(quantityInput.value);

  if (quantity > 0) {
    const product = products.find((p) => p.id === productId);
    const existingCartItem = cart.find((item) => item.id === productId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity: quantity,
      });
    }

    localStorage.setItem("quickmart-cart", JSON.stringify(cart));

    updateCartSummary();
    quantityInput.value = 0;
    alert(`Added ${quantity} ${product.name} to cart!`);
  }
}

function updateCartSummary() {
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  document.getElementById("cart-total").textContent = cartTotal.toFixed(2);
  document.getElementById("cart-item-count").textContent = cartItemCount;
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length > 0) {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    const orderSummary = {
      items: cart,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(
      "quickmart-order-summary",
      JSON.stringify(orderSummary)
    );

    window.location.href = "cart.html";
  } else {
    const errorModal = new bootstrap.Modal(
      document.getElementById("errorModal")
    );
    errorModal.show();
  }
});

async function logout() {
  console.log("Logout function called");
  try {
    console.log("Removing login status...");
    localStorage.removeItem("isLoggedIn");

    console.log("Clearing cart...");
    localStorage.removeItem("quickmart-cart");

    console.log("Signing out from Firebase...");
    await signOut(auth);

    console.log("Redirecting to home page...");
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");
  renderProducts();
  updateCartSummary();

  const logoutBtn = document.getElementById("logout-btn");
  console.log("Logout button found:", logoutBtn);
  if (logoutBtn) {
    console.log("Adding logout event listener");
    logoutBtn.addEventListener("click", logout);
  } else {
    console.error("Logout button not found!");
  }
});
