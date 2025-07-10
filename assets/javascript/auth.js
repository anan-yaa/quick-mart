import { auth, app } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// signup function exported
export const signup = async (email, password, userData) => {
  console.log("signup function called with userData:", userData);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", result);
    await updateProfile(result.user, {
      displayName: userData.displayName,
    });
    console.log("Profile updated with name:", userData.displayName);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Firebase error:", error);
    return { success: false, error: error.message };
  }
};

// login function exported
export const login = async (email, password) => {
  console.log("login function called");
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Firebase login result:", result);
    return { success: true, user: result.user };
  } catch (error) {
    console.log("Firebase login error:", error);
    return { success: false, error: error.message };
  }
};

// logout function exported
export const logout = async () => {
  try {
    // Remove login status first to prevent redirect loops
    localStorage.removeItem("isLoggedIn");
    
    // Clear cart data
    localStorage.removeItem("quickmart-cart");
    
    // Sign out from Firebase
    await signOut(auth);
    
    // Redirect to home page
    window.location.href = "../index.html";
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
};
