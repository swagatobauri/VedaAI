import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

let app: any = null;
let auth: any = null;
let googleProvider: any = null;

// Only initialize Firebase if we have a valid API key (prevents crash on load)
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.warn("Firebase config is missing or invalid. Google Auth will be disabled.");
  
  // Create a mock auth object that throws a helpful error when used
  auth = {
    _isMock: true
  };
}

// Override signInWithPopup to throw a helpful error if Firebase isn't configured
const customSignInWithPopup = async (authInstance: any, provider: any) => {
  if (authInstance?._isMock) {
    throw new Error("Firebase is not configured! Please add your keys to frontend/.env.local as described in the walkthrough.");
  }
  return signInWithPopup(authInstance, provider);
};

export { app, auth, googleProvider, customSignInWithPopup as signInWithPopup, signInWithRedirect };
