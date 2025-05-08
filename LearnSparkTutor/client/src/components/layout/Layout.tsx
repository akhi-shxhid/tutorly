import { ReactNode } from 'react';
import Navbar from './Navbar';
import { AuthProvider } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Top Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
};

export default Layout;
