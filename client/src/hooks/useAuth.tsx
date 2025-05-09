import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a mock user for development
    const mockUser = {
      id: 'dev-user-123',
      displayName: 'Dev User',
      email: 'dev@example.com',
      photoURL: null,
    };
    
    // Register the mock user with our API
    setTimeout(async () => {
      try {
        await apiRequest('/api/users', {
          method: 'POST',
          body: {
            uid: mockUser.id,
            username: mockUser.displayName || 'User',
            email: mockUser.email || '',
            photoURL: mockUser.photoURL,
          },
        });
      } catch (error) {
        console.error('Error registering mock user with API:', error);
      }
      
      setUser(mockUser);
      setLoading(false);
    }, 500);
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