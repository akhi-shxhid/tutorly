import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChange } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { apiRequest } from '@/lib/queryClient';

// Check if we're in development mode without Firebase keys
const isDevModeWithoutFirebase = 
  import.meta.env.DEV && 
  !(import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_PROJECT_ID && 
    import.meta.env.VITE_FIREBASE_APP_ID);

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In dev mode without Firebase keys, create a mock user and skip auth
    if (isDevModeWithoutFirebase) {
      console.info("Running in dev mode without Firebase keys - using mock authentication");
      
      // Create a mock user for development
      const mockUser = {
        uid: 'dev-user-123',
        displayName: 'Dev User',
        email: 'dev@example.com',
        photoURL: null,
      } as unknown as FirebaseUser;
      
      // Register the mock user with our API
      setTimeout(async () => {
        try {
          await apiRequest('POST', '/api/users', {
            uid: mockUser.uid,
            username: mockUser.displayName || 'User',
            email: mockUser.email || '',
            photoURL: mockUser.photoURL,
          });
        } catch (error) {
          console.error('Error registering mock user with API:', error);
        }
        
        setUser(mockUser);
        setLoading(false);
      }, 500);
      
      return () => {};
    }
    
    // Normal Firebase authentication flow
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // When user signs in, create or fetch user from our API
        try {
          await apiRequest('POST', '/api/users', {
            uid: firebaseUser.uid,
            username: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL,
          });
        } catch (error) {
          console.error('Error registering user with API:', error);
        }
      }
      
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
