import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC51A73-s1dm3eCyrxohHYApHYocwmCr4k",
  authDomain: "digital-asset-tracker-c7f2f.firebaseapp.com",
  projectId: "digital-asset-tracker-c7f2f",
  storageBucket: "digital-asset-tracker-c7f2f.firebasestorage.app",
  messagingSenderId: "525624332218",
  appId: "1:525624332218:web:0d02b18a7f7c9bcf159783",
  measurementId: "G-3PBPZFKJRM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
