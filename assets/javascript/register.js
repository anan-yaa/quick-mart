import { signup } from "./auth.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, looking for form");

  const form = document.getElementById("register-form");
  console.log("Form found:", form);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Form submitted");
      const firstName = document.getElementById("first-name").value;
      const lastName = document.getElementById("last-name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const userData = {
        firstName,
        lastName,
        email,
        displayName: `${firstName} ${lastName}`.trim(),
      };

      const result = await signup(email, password, userData);
      console.log("Signup result:", result);

      if (result.success) {
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "../pages/account.html";
      } else {
        alert("Signup failed: " + result.error);
      }
    });
  } else {
    console.log("Form not found! Check your form ID");
  }
});
