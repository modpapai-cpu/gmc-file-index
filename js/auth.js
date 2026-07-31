// =========================================
// GMC File Index Pro
// Authentication
// =========================================

import {
    auth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "./firebase.js";

// =========================================
// Login
// =========================================
export async function login(email, password) {

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: userCredential.user
        };

    } catch (error) {

        console.error(error);

        return {
            success: false,
            message: error.message
        };

    }

}

// =========================================
// Logout
// =========================================
export async function logout() {

    try {

        await signOut(auth);

        return true;

    } catch (error) {

        console.error(error);

        return false;

    }

}

// =========================================
// Check Login Status
// =========================================
export function checkAuth(callback) {

    onAuthStateChanged(auth, (user) => {

        callback(user);

    });

}
