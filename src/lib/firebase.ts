import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database with custom databaseId if configured
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Ensure authenticated session for Firestore operations
if (typeof window !== 'undefined') {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.warn('Anonymous auth note:', err?.message || err);
      });
    }
  });
}

export default app;
