import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const isBrowser = typeof window !== "undefined";

const app = isBrowser && getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const analytics = isBrowser 
    ? isSupported().then((yes) => (yes ? getAnalytics(app) : null))
    : null;
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { analytics, auth, firestore, storage, googleProvider };
