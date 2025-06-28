// This file is safe to use on the client side.
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

export const appId = typeof process.env.NEXT_PUBLIC_APP_ID !== 'undefined' ? process.env.NEXT_PUBLIC_APP_ID : 'marketing-plan-builder-app';

const fallbackConfig = {
    apiKey: "your-fallback-api-key",
    authDomain: "your-fallback-auth-domain",
    projectId: "your-fallback-project-id",
    storageBucket: "your-fallback-storage-bucket",
    messagingSenderId: "your-fallback-sender-id",
    appId: "your-fallback-app-id"
};

const firebaseConfig = typeof process.env.NEXT_PUBLIC_FIREBASE_CONFIG !== 'undefined'
    ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
    : fallbackConfig;

export const isFirebaseConfigured = firebaseConfig.apiKey !== "your-fallback-api-key";

export const initialAuthToken = typeof process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN !== 'undefined' ? process.env.NEXT_PUBLIC_INITIAL_AUTH_TOKEN : '';

// Conditionally initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
}

export { app, auth, db };
