import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChange } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { apiRequest } from '@/lib/queryClient';

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
