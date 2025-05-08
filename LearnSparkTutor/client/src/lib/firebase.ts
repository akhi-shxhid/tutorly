import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Check if Firebase configuration is complete
const hasValidFirebaseConfig = !!(
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_APP_ID
);

// Create dummy Firebase instances for when config is missing
const dummyApp = {};
const dummyAuth = {
  currentUser: null,
  onAuthStateChanged: (_callback: any) => {
    return () => {}; // Return a no-op unsubscribe function
  }
};
const dummyStorage = {};
const dummyFirestore = {};
const dummyGoogleProvider = {};

// Firebase configuration from environment variables
let app: any = dummyApp;
let auth: any = dummyAuth;
let storage: any = dummyStorage;
let firestore: any = dummyFirestore;
let googleProvider: any = dummyGoogleProvider;

if (hasValidFirebaseConfig) {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
    firestore = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete. Authentication will not work.");
}

// Authentication functions
export const signInWithGoogle = async () => {
  if (!hasValidFirebaseConfig) {
    console.error("Cannot sign in: Firebase configuration is incomplete");
    throw new Error("Firebase configuration is incomplete");
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logoutUser = async () => {
  if (!hasValidFirebaseConfig) {
    console.error("Cannot sign out: Firebase configuration is incomplete");
    return;
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!hasValidFirebaseConfig) {
    // If Firebase isn't configured, immediately call the callback with null
    // and return a no-op unsubscribe function
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

// Export Firebase services
export { auth, storage, firestore };
export default app;
