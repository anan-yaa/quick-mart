import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

export function initAuthGuard() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
        } else if (!window.location.pathname.includes('index.html') && 
                   !window.location.pathname.includes('login.html') &&
                   !window.location.pathname.includes('register.html')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = '../auth/login.html';
        }
    });
}