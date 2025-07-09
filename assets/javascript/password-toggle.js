document.addEventListener("DOMContentLoaded", function () {
  const toggleIcons = document.querySelectorAll(".password-toggle");

  toggleIcons.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordField = this.closest(".password-field");
      const input = passwordField.querySelector("input");
      const icon = this.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    });
  });
});
