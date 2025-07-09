import { initAuthGuard } from "./auth-guard.js";
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = initAuthGuard();
  if (isLoggedIn) {
    window.location.href = "../pages/account.html";
  }
});
