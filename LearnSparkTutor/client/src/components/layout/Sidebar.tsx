import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { logoutUser } from "@/lib/firebase";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface NavigationItem {
  name: string;
  icon: string;
  path: string;
}

interface LearningPath {
  name: string;
  icon: string;
}

const Sidebar = ({ closeMobileMenu }: { closeMobileMenu: () => void }) => {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const navigationItems: NavigationItem[] = [
    { name: "Dashboard", icon: "fa-home", path: "/dashboard" },
    { name: "AI Tutor", icon: "fa-robot", path: "/ai-tutor" },
    { name: "Flashcards", icon: "fa-layer-group", path: "/flashcards" },
    { name: "Quizzes", icon: "fa-question-circle", path: "/quizzes" },
    { name: "Documents", icon: "fa-file-alt", path: "/documents" },
  ];

  const learningPaths: LearningPath[] = [
    { name: "Python Programming", icon: "fa-code" },
    { name: "JavaScript & Web", icon: "fa-laptop-code" },
    { name: "AI & Machine Learning", icon: "fa-brain" },
    { name: "Cloud Computing", icon: "fa-cloud" },
  ];

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
    <div className="w-64 min-h-full bg-base-200 dark:bg-slate-900 text-base-content flex flex-col">
      {/* Logo & App Name */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold mr-3">
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold">SparkTutor</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI-Powered Learning</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <ul className="menu p-4 gap-2 flex-grow">
        {navigationItems.map((item) => (
          <li key={item.path}>
            <Link href={item.path}>
              <div 
                onClick={closeMobileMenu}
                className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                  location === item.path 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-primary/5"
                }`}
              >
                <i className={`fas ${item.icon} w-5`}></i> 
                <span className="ml-2">{item.name}</span>
              </div>
            </Link>
          </li>
        ))}
        
        <li className="menu-title pt-4">
          <span>Learning Paths</span>
        </li>
        
        {learningPaths.map((path, index) => (
          <li key={index}>
            <div className="flex items-center px-3 py-2 rounded-md transition-colors duration-200 cursor-pointer hover:bg-primary/5">
              <i className={`fas ${path.icon} w-5`}></i> 
              <span className="ml-2">{path.name}</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary opacity-80">
                Coming Soon
              </span>
            </div>
          </li>
        ))}
      </ul>
      
      {/* User Profile & Settings */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
            <span className="ml-2 text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>
        </div>
        
        {user && (
          <div className="flex items-center">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-primary overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} />
                ) : (
                  <span className="font-bold">{user.displayName?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium">{user.displayName || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <i className="fas fa-ellipsis-vertical"></i>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
