import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import StatsCard from '@/components/dashboard/StatsCard';
import LearningProgress from '@/components/dashboard/LearningProgress';
import SessionsTable from '@/components/dashboard/SessionsTable';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'wouter';

const Dashboard = () => {
  const { user } = useAuth();
  const [showQuickAccess, setShowQuickAccess] = useState(true);
  
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/users', user?.uid, 'study-sessions'],
    enabled: !!user?.uid,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };
  
  const quickAccessTools = [
    { name: "AI Tutor Chat", icon: "fa-robot", color: "bg-blue-600", path: "/ai-tutor" },
    { name: "Study Flashcards", icon: "fa-layer-group", color: "bg-violet-600", path: "/flashcards" },
    { name: "Take a Quiz", icon: "fa-question-circle", color: "bg-emerald-600", path: "/quizzes" },
    { name: "Upload Documents", icon: "fa-file-alt", color: "bg-amber-600", path: "/documents" },
  ];

  return (
    <motion.div 
      className="mb-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        variants={item}
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Continue your learning journey</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button className="flex items-center bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <i className="fas fa-plus mr-2"></i> New Study Session
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-slate-200 dark:border-slate-700">
                <i className="fas fa-ellipsis-vertical"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-in slide-in-from-top-5 fade-in-70">
              <DropdownMenuItem>
                <i className="fas fa-cog mr-2"></i> Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-user mr-2"></i> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Quick Access Tools */}
      {showQuickAccess && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={item}
        >
          {quickAccessTools.map((tool, index) => (
            <Link href={tool.path} key={index}>
              <motion.div
                className="bg-slate-800 hover:bg-slate-700 rounded-xl p-4 cursor-pointer shadow-lg transition-transform duration-200 hover:scale-105"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className={`${tool.color} rounded-lg w-12 h-12 flex items-center justify-center text-white mr-4`}>
                    <i className={`fas ${tool.icon} text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{tool.name}</h3>
                    <p className="text-xs text-slate-400">Quick access</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Stats Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={item}
      >
        <motion.div variants={fadeIn}>
          <StatsCard 
            title="Study Time" 
            value="14h 32m" 
            icon="fa-clock" 
            iconBgClass="bg-blue-100 dark:bg-blue-900" 
            iconTextClass="text-primary"
            trend="12% from last week"
            trendUp={true}
          />
        </motion.div>
        
        <motion.div variants={fadeIn}>
          <StatsCard 
            title="Flashcards" 
            value="132" 
            icon="fa-layer-group" 
            iconBgClass="bg-violet-100 dark:bg-violet-900" 
            iconTextClass="text-secondary"
            trend="8 new this week"
            trendUp={true}
          />
        </motion.div>
        
        <motion.div variants={fadeIn}>
          <StatsCard 
            title="Quiz Score" 
            value="87%" 
            icon="fa-chart-line" 
            iconBgClass="bg-emerald-100 dark:bg-emerald-900" 
            iconTextClass="text-success"
            trend="4% improvement"
            trendUp={true}
          />
        </motion.div>
      </motion.div>

      {/* Learning Progress */}
      <motion.div variants={item}>
        <LearningProgress />
      </motion.div>

      {/* Recent Study Sessions */}
      <motion.div variants={item}>
        <SessionsTable isLoading={sessionsLoading} sessions={Array.isArray(sessions) ? sessions : []} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
