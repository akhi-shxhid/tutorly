import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { logoutUser } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavigationItem {
  name: string;
  icon: string;
  path: string;
}

const Navbar = () => {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", icon: "fa-home", path: "/dashboard" },
    { name: "AI Tutor", icon: "fa-robot", path: "/ai-tutor" },
    { name: "Flashcards", icon: "fa-layer-group", path: "/flashcards" },
    { name: "Quizzes", icon: "fa-question-circle", path: "/quizzes" },
    { name: "Summaries", icon: "fa-file-alt", path: "/summaries" },
  ];

  // Handle scroll event to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      {/* Main navbar */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${scrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg' : 'bg-slate-900'}
        ${location === '/' ? 'py-4' : 'py-2'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <div className="flex items-center cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white mr-3">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <span className="font-bold text-xl text-white hidden sm:block">SparkTutor</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors duration-200
                      ${
                        location === item.path 
                          ? 'bg-primary/20 text-primary-foreground' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={toggleTheme}
              >
                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
              </Button>

              {/* User Profile */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-2 hover:bg-slate-800 px-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt={user.displayName || 'User'} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="font-bold text-white">{user.displayName?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <span className="text-sm text-white hidden sm:block truncate max-w-[120px]">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-5 fade-in-70">
                    <div className="px-2 py-2 border-b border-slate-200 dark:border-slate-700">
                      <p className="font-medium">{user.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuItem className="cursor-pointer">
                      <i className="fas fa-user mr-2"></i> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <i className="fas fa-cog mr-2"></i> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
                onClick={toggleMobileMenu}
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-sm pt-16"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div 
                  className={`block px-4 py-3 rounded-md text-base font-medium ${
                    location === item.path 
                      ? 'bg-primary/20 text-primary-foreground' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fas ${item.icon} mr-3 w-5 text-center`}></i>
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      {/* Spacer for fixed navbar */}
      <div className={`h-16 ${location === '/' ? 'h-20' : 'h-16'}`}></div>
    </>
  );
};

export default Navbar;