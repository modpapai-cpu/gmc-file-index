// =========================================
// GMC File Index Pro
// Firebase Configuration
// =========================================

// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =========================================
// Firebase Config
// =========================================

const firebaseConfig = {

    apiKey: "AIzaSyDt_kBM88A9LVbMDP6xH6TaPqssbQXwpWM",

    authDomain: "gmc-file-index-pro.firebaseapp.com",

    projectId: "gmc-file-index-pro",

    storageBucket: "gmc-file-index-pro.firebasestorage.app",

    messagingSenderId: "242139752602",

    appId: "1:242139752602:web:f58907e628795de05fd723"

};


// =========================================
// Initialize Firebase
// =========================================

const app = initializeApp(firebaseConfig);


// =========================================
// Authentication
// =========================================

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


// =========================================
// Firestore
// =========================================

const db = getFirestore(app);


// =========================================
// Export Everything
// =========================================

export {

    app,

    auth,

    db,

    googleProvider,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    collection,

    doc,

    addDoc,

    getDocs,

    getDoc,

    updateDoc,

    deleteDoc,

    query,

    where,

    orderBy,

    onSnapshot

};