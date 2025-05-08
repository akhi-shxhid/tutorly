import { useState, useEffect } from 'react';
import { signInWithGoogle } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Check if we're in development mode without Firebase keys
const isDevModeWithoutFirebase = 
  import.meta.env.DEV && 
  !(import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_PROJECT_ID && 
    import.meta.env.VITE_FIREBASE_APP_ID);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [showingMockLoginNotice, setShowingMockLoginNotice] = useState(false);
  
  useEffect(() => {
    // Show the mock login notice after a brief delay if we're missing Firebase config
    if (isDevModeWithoutFirebase) {
      const timer = setTimeout(() => {
        setShowingMockLoginNotice(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // If we're in dev mode without Firebase keys, just show a notice
      if (isDevModeWithoutFirebase) {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
          title: "Development Mode",
          description: "Using mock authentication since Firebase keys are not configured",
        });
        
        // The AuthProvider will automatically log us in with a mock user
        return;
      }
      
      // Normal Firebase authentication
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "There was an error logging in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center text-white text-2xl">
              <i className="fas fa-bolt"></i>
            </div>
          </div>
          <CardTitle className="text-2xl">SparkTutor</CardTitle>
          <CardDescription>
            AI-Powered Learning Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="mb-4">Sign in to continue to your personalized learning experience</p>
            </div>
            <Button 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <i className="fas fa-spinner"></i>
                  </span>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <i className="fab fa-google mr-2"></i>
                  Sign in with Google
                </div>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            By signing in, you agree to our Terms and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
