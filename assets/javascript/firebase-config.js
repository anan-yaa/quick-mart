// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDNHamWyZdY9lH18TSv9NiM7nlrTHrq91g",
  authDomain: "quickmart-1.firebaseapp.com",
  projectId: "quickmart-1",
  storageBucket: "quickmart-1.firebasestorage.app",
  messagingSenderId: "606673820019",
  appId: "1:606673820019:web:7fc02c1428964828e94d06",
  measurementId: "G-ZD7M43K2CF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);