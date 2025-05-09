import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Required Firebase configuration keys
const REQUIRED_CONFIG_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const missingKeys = REQUIRED_CONFIG_KEYS.filter(key => !import.meta.env[key]);
  
  if (missingKeys.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        `Missing Firebase configuration keys: ${missingKeys.join(', ')}\n` +
        'Using mock authentication for development.'
      );
      return false;
    }
    throw new Error(`Missing required Firebase configuration keys: ${missingKeys.join(', ')}`);
  }
  return true;
};

const hasValidFirebaseConfig = validateFirebaseConfig();

// Initialize Firebase or mock services
const initializeFirebase = () => {
  if (!hasValidFirebaseConfig) {
    return {
      app: {},
      auth: {
        currentUser: null,
        onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
          // Simulate delayed auth state change for development
          setTimeout(() => callback(null), 100);
          return () => {};
        }
      },
      storage: {},
      firestore: {},
      googleProvider: {}
    };
  }

  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const storage = getStorage(app);
    const firestore = getFirestore(app);
    const googleProvider = new GoogleAuthProvider();

    return { app, auth, storage, firestore, googleProvider };
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw new Error("Failed to initialize Firebase services");
  }
};

const { app, auth, storage, firestore, googleProvider } = initializeFirebase();

// Authentication functions with proper error handling
export const signInWithGoogle = async (): Promise<FirebaseUser> => {
  if (!hasValidFirebaseConfig) {
    throw new Error("Firebase authentication is not configured");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    throw new Error(error.message || "Failed to sign in with Google");
  }
};

export const logoutUser = async (): Promise<void> => {
  if (!hasValidFirebaseConfig) {
    console.warn("Firebase authentication is not configured");
    return;
  }
  
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Sign out error:", error);
    throw new Error(error.message || "Failed to sign out");
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void): (() => void) => {
  if (!hasValidFirebaseConfig) {
    // Simulate auth state for development
    setTimeout(() => callback(null), 100);
    return () => {};
  }
  
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error("Auth state change error:", error);
    callback(null);
    return () => {};
  }
};

// Export Firebase services
export { auth, storage, firestore };
export default app;