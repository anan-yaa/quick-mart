
const products = [
  {
    id: 1,
    name: "Fresh Apples",
    price: 49.99,
    image: "../assets/images/apples.jpg",
    category: "Fruits",
  },
  {
    id: 2,
    name: "Organic Bananas",
    price: 29.99,
    image: "../assets/images/bananas.jpg",
    category: "Fruits",
  },
  {
    id: 3,
    name: "Whole Milk",
    price: 59.49,
    image: "../assets/images/milk.jpg",
    category: "Dairy",
  },
  {
    id: 4,
    name: "Bread Loaf",
    price: 39.49,
    image: "../assets/images/bread.jpg",
    category: "Bakery",
  },
  {
    id: 5,
    name: "Eggs (Dozen)",
    price: 69.99,
    image: "../assets/images/eggs.jpg",
    category: "Dairy",
  },
  {
    id: 6,
    name: "Chicken Breast",
    price: 99.99,
    image: "../assets/images/chicken.jpg",
    category: "Meat",
  },
];

// initial cart (empty)
let cart = JSON.parse(localStorage.getItem("quickmart-cart")) || [];
console.log("Initial cart:", cart); 

function renderCartItems() {
  const cartContainer = document.getElementById("cart-items-container");
  cartContainer.innerHTML = "";

  if (!cart || cart.length === 0) {
    cartContainer.innerHTML = '<p class="text-center">Your cart is empty</p>';
    return;
  }

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";
    cartItemDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h6>${item.name}</h6>
                    <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <strong>₹${(item.price * item.quantity).toFixed(2)}</strong>
        `;
    cartContainer.appendChild(cartItemDiv);
  });

  updateOrderSummary();
}

function updateOrderSummary() {
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  document.getElementById("cart-subtotal").textContent = `₹${subtotal.toFixed(
    2
  )}`;
  document.getElementById("cart-tax").textContent = `₹${tax.toFixed(2)}`;
  document.getElementById("cart-total").textContent = `₹${total.toFixed(2)}`;
}

document.getElementById("place-order-btn").addEventListener("click", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const form = document.getElementById("checkout-form");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const orderSummary = {
    items: cart,
    shipping: {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      zipCode: document.getElementById("zipCode").value,
    },
    payment: document.getElementById("paymentMethod").value,
    subtotal: parseFloat(
      document.getElementById("cart-subtotal").textContent.replace("₹", "")
    ),
    tax: parseFloat(
      document.getElementById("cart-tax").textContent.replace("₹", "")
    ),
    total: parseFloat(
      document.getElementById("cart-total").textContent.replace("₹", "")
    ),
  };

  localStorage.setItem("quickmart-last-order", JSON.stringify(orderSummary));
  localStorage.removeItem("quickmart-cart");
  cart = [];

  window.location.href = "order-conf.html";
});

document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
});
