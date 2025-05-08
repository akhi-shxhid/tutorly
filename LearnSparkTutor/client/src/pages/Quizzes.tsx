import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import QuizCard from '@/components/quizzes/QuizCard';
import ActiveQuiz from '@/components/quizzes/ActiveQuiz';
import { Button } from '@/components/ui/button';

const Quizzes = () => {
  const { user } = useAuth();
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['/api/users', user?.uid, 'quizzes'],
    enabled: !!user?.uid,
  });

  const handleStartQuiz = (quizId: number) => {
    setActiveQuiz(quizId);
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button>
            <i className="fas fa-plus mr-2"></i> Create Quiz
          </Button>
          <Button variant="outline">
            <i className="fas fa-history mr-2"></i> History
          </Button>
        </div>
      </div>

      {activeQuiz ? (
        <ActiveQuiz quizId={activeQuiz} onClose={handleCloseQuiz} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="card bg-base-100 dark:bg-slate-700 shadow-xl animate-pulse">
                <div className="card-body">
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-5/6 mb-4"></div>
                  <div className="mt-4 flex justify-end">
                    <div className="h-8 w-24 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : quizzes && quizzes.length > 0 ? (
            quizzes.map((quiz: any) => (
              <QuizCard 
                key={quiz.id} 
                quiz={quiz} 
                onStart={() => handleStartQuiz(quiz.id)} 
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <div className="mb-4 text-4xl text-slate-400">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Create your first quiz or generate one from your documents
              </p>
              <Button>
                <i className="fas fa-plus mr-2"></i> Create Quiz
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;
