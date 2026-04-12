import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { CONFIG } from "#/config";

const firebaseConfig = {
    apiKey: CONFIG.firebaseConfig.apiKey,
    authDomain: CONFIG.firebaseConfig.authDomain,
    projectId: CONFIG.firebaseConfig.projectId,
    storageBucket: CONFIG.firebaseConfig.storageBucket,
    messagingSenderId: CONFIG.firebaseConfig.messagingSenderId,
    appId: CONFIG.firebaseConfig.appId,
    measurementId: CONFIG.firebaseConfig.measurementId
};

const app = (getApps().length > 0) ? getApp() : initializeApp(firebaseConfig);
const analytics = isSupported().then((yes) => (yes ? getAnalytics(app) : null))
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { analytics, auth, firestore, storage };
