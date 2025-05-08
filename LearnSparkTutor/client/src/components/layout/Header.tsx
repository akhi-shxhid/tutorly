import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header = ({ toggleMobileMenu }: HeaderProps) => {
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div className={`navbar bg-slate-900/80 backdrop-blur-md lg:hidden sticky top-0 z-30 transition-all duration-300 ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <div className="navbar-start">
        <Button 
          variant="ghost" 
          onClick={toggleMobileMenu}
          className="hover:bg-slate-800 text-white"
        >
          <i className="fas fa-bars"></i>
        </Button>
      </div>
      <div className="navbar-center">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white mr-2">
            <i className="fas fa-bolt"></i>
          </div>
          <span className="text-xl font-bold text-white">SparkTutor</span>
        </div>
      </div>
      <div className="navbar-end">
        <Button 
          variant="ghost" 
          size="icon"
          className="mr-2 hover:bg-slate-800 text-white" 
          onClick={toggleTheme}
        >
          <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
        </Button>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-slate-800 rounded-full overflow-hidden"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <i className="fas fa-user mr-2"></i> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2"></i> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
