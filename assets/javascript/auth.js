import { auth, app } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Signup function
export const signup = async (email, password, userData) => {
  console.log("signup function called with userData:", userData);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created:", result);

    // Update the user's profile with display name
    await updateProfile(result.user, {
      displayName: userData.displayName
    });
    console.log("Profile updated with name:", userData.displayName);

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Firebase error:", error);
    return { success: false, error: error.message };
  }
};

// Login function
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

// Logout function
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};