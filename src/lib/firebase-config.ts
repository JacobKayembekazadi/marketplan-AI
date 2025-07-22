// This file is safe to use on the client side.
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firestore";

export const appId = 'marketing-plan-builder-app';

// Firebase is disregarded, so we use dummy values.
const firebaseConfig = {
    apiKey: "dummy",
    authDomain: "dummy",
    projectId: "dummy",
    storageBucket: "dummy",
    messagingSenderId: "dummy",
    appId: "dummy"
};

export const isFirebaseConfigured = false;
export const initialAuthToken = '';

// Conditionally initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export { app, auth, db };
