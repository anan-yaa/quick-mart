import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "./firebase-config.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);
const db = getFirestore(app);

function showToast(type, message) {
  const toast = document.getElementById(`${type}Toast`);
  const toastBody = toast.querySelector(".toast-body");
  toastBody.textContent = message;

  const bsToast = new bootstrap.Toast(toast, {
    delay: 3000,
  });
  bsToast.show();
}

document
  .getElementById("profile-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const fullName = `${firstName} ${lastName}`.trim();
        const dob = document.getElementById("dob").value;
        const email = document.getElementById("email").value;

        await updateProfile(user, {
          displayName: fullName,
        });
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            firstName,
            lastName,
            email,
            dob,
            displayName: fullName,
            updatedAt: new Date().toISOString(),
          },
          {
            merge: true,
          }
        );

        document.getElementById("user-name").textContent = fullName;
        document.getElementById("user-email").textContent = email;

        showToast("success", "Profile updated successfully!");
      } catch (error) {
        console.error("Update error:", error);
        showToast("error", "Error updating profile: " + error.message);
      }
    } else {
      showToast("error", "Please log in to update your profile");
      window.location.href = "../auth/login.html";
    }
  });

document
  .getElementById("address-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const address = {
          street: document.getElementById("street-address").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          postalCode: document.getElementById("postal-code").value,
          country: document.getElementById("country").value,
        };

        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            address,
            updatedAt: new Date().toISOString(),
          },
          {
            merge: true,
          }
        );

        showToast("success", "Address updated successfully!");
      } catch (error) {
        console.error("Update error:", error);
        showToast("error", "Error updating address: " + error.message);
      }
    }
  });

async function loadUserData() {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();

        document.getElementById("first-name").value = data.firstName || "";
        document.getElementById("last-name").value = data.lastName || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("dob").value = data.dob || "";

        // Fill in address fields if they exist
        if (data.address) {
          document.getElementById("street-address").value =
            data.address.street || "";
          document.getElementById("city").value = data.address.city || "";
          document.getElementById("state").value = data.address.state || "";
          document.getElementById("postal-code").value =
            data.address.postalCode || "";
          document.getElementById("country").value = data.address.country || "";
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }
}

onAuthStateChanged(auth, (user) => {
  console.log(
    "Auth state changed:",
    user ? "User logged in" : "User logged out"
  );

  if (!user) {
    console.log("No user, checking if should redirect to login");
    // Temporarily disable redirect to test logout
    console.log("User logged out - not redirecting to allow logout to work");
  } else if (user) {
    console.log("User is logged in, updating UI");
    const [firstName, lastName] = (
      user.displayName || user.email.split("@")[0]
    ).split(" ");

    document.getElementById("user-name").textContent =
      user.displayName || user.email.split("@")[0];
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("email").value = user.email;
    document.getElementById("first-name").value = firstName || "";
    document.getElementById("last-name").value = lastName || "";

    loadUserData();

    localStorage.setItem("isLoggedIn", "true");
  }
});

document
  .getElementById("password-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const user = auth.currentUser;
    const newPassword = document.querySelector(
      '#v-pills-settings input[type="password"]'
    ).value;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        showToast("success", "Password updated successfully!");
        document.getElementById("password-form").reset();
      } catch (error) {
        showToast("error", "Error updating password: " + error.message);
      }
    }
  });

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    if (!link.href.includes("login.html") && !link.href.includes("logout")) {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        e.preventDefault();
        window.location.href = "../auth/login.html";
      }
    }
  });
});
