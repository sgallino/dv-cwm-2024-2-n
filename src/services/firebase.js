// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsS7KDGZNMiL3aGMh3bBHDcDa_MaMW1XI",
    authDomain: "cwm-2024-2-n-p.firebaseapp.com",
    projectId: "cwm-2024-2-n-p",
    storageBucket: "cwm-2024-2-n-p.appspot.com",
    messagingSenderId: "564230285189",
    appId: "1:564230285189:web:b00cc5f6658ca3e81986ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Firestore, guardamos la referencia a la base, y la exportamos.
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);