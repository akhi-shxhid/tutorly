import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AITutor from "@/pages/AITutor";
import Flashcards from "@/pages/Flashcards";
import Quizzes from "@/pages/Quizzes";
import Summaries from "@/pages/Summaries";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

function Router() {
  const { user, loading } = useAuth();
  const [location] = useLocation();

  // Landing page paths - these don't require authentication
  const publicPaths = ['/', '/login'];
  const isPublicPath = publicPaths.includes(location);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="w-16 h-16 border-4 border-primary border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Show the landing page for the root path when not logged in
  if (!user && location === '/') {
    return <Landing />;
  }

  // Show login for other protected paths when not logged in
  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  // If logged in and on public pages, redirect to dashboard
  if (user && isPublicPath) {
    window.location.href = '/dashboard';
    return null;
  }

  // User is logged in and trying to access protected routes
  return (
    <Layout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/ai-tutor" component={AITutor} />
        <Route path="/flashcards" component={Flashcards} />
        <Route path="/quizzes" component={Quizzes} />
        <Route path="/documents" component={Summaries} />
        <Route path="/summaries" component={Summaries} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <AuthProvider>
            <Router />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
