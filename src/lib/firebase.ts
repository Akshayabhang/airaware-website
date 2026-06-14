import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
} from "firebase/auth";

// Firebase configuration — AirAware project
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCU9w9VH9dzIuOdI74kBMW0URK4o6OEbQ0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "airaware-811d4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "airaware-811d4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "airaware-811d4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "230287516876",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:230287516876:web:d8b41e05cb58413a01ce69",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-5HTEY89X88",
};

// Initialize Firebase (ensuring it works well in Next.js Hot Reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, name: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // Update user profile display name
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: name });
  }
  return userCredential.user;
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
}

/**
 * Sign Out
 */
export async function logout() {
  await signOut(auth);
}
