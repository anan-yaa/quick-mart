// Dynamically load Bootstrap
const bootstrapScript = document.createElement("script");
bootstrapScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js";
document.head.appendChild(bootstrapScript);

import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Logout functionality
async function logout() {
  try {
    // Remove login status first to prevent redirect loops
    localStorage.removeItem("isLoggedIn");

    // Clear cart data
    localStorage.removeItem("quickmart-cart");

    // Sign out from Firebase
    await signOut(auth);

    // Redirect to home page
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Error signing out:", error);
    alert("Error signing out: " + error.message);
  }
}

// Add event listener for logout button
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
