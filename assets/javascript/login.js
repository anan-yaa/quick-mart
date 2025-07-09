import { login } from "./auth.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "none";

  const result = await login(email, password);
  if (result.success) {
    window.location.href = "../pages/account.html";
  } else {
    errorMessage.style.display = "block";
  }
});
