// This file is safe to use on the client side.
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const appId = typeof process.env.NEXT_PUBLIC_APP_ID !== 'undefined' ? process.env.NEXT_PUBLIC_APP_ID : 'marketing-plan-builder-app';

const firebaseConfig = typeof process.env.NEXT_PUBLIC_FIREBASE_CONFIG !== 'undefined' ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) : {
    apiKey: "your-fallback-api-key",
    authDomain: "your-fallback-auth-domain",
    projectId: "your-fallback-project-id",
    storageBucket: "your-fallback-storage-bucket",
    messagingSenderId: "your-fallback-sender-id",
    appId: "your-fallback-app-id"
};

export const initialAuthToken = typeof process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN !== 'undefined' ? process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN : '';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
