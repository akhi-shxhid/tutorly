import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ActiveQuizProps {
  quizId: number;
  onClose: () => void;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  code?: string;
  options: string[];
  correctAnswer: string;
}

const ActiveQuiz = ({ quizId, onClose }: ActiveQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { toast } = useToast();

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['/api/quizzes', quizId],
  });
  
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/quizzes', quizId, 'questions'],
  });

  // Reset selected answer when changing questions
  useEffect(() => {
    setSelectedAnswer('');
    setIsAnswerSubmitted(false);
  }, [currentQuestionIndex]);

  const isLoading = quizLoading || questionsLoading;
  
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <CardTitle>Loading Quiz...</CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          <div className="flex justify-center items-center p-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!quiz || !questions || questions.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz Error</CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          <div className="p-6 text-center">
            <p className="text-lg mb-4">Could not load quiz questions.</p>
            <Button onClick={onClose}>Return to Quizzes</Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  const currentQuestion: QuizQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (value: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(value);
    }
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Update quiz progress
      try {
        await apiRequest('PATCH', `/api/quizzes/${quizId}/progress`, {
          progress: currentQuestionIndex + 1
        });
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } catch (error) {
        console.error('Error updating quiz progress:', error);
        toast({
          title: "Progress update failed",
          description: "Failed to update quiz progress",
          variant: "destructive",
        });
      }
    } else {
      // Quiz completed
      try {
        const finalScore = Math.round((correctAnswers / questions.length) * 100);
        
        await apiRequest('PATCH', `/api/quizzes/${quizId}/progress`, {
          progress: questions.length,
          score: finalScore
        });
        
        toast({
          title: "Quiz Completed!",
          description: `Your score: ${finalScore}%`,
        });
        
        // Invalidate quiz cache to get updated data
        queryClient.invalidateQueries({ queryKey: ['/api/users'] });
        onClose();
      } catch (error) {
        console.error('Error completing quiz:', error);
        toast({
          title: "Could not save quiz results",
          description: "Failed to save your quiz results",
          variant: "destructive",
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const checkAnswer = () => {
    if (!selectedAnswer) {
      toast({
        title: "Select an answer",
        description: "Please select an answer before checking",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnswerSubmitted(true);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const getAnswerClass = (option: string) => {
    if (!isAnswerSubmitted) return "bg-slate-50 dark:bg-slate-700";
    
    if (option === currentQuestion.correctAnswer) {
      return "bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-600";
    }
    
    if (option === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
      return "bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-600";
    }
    
    return "bg-slate-50 dark:bg-slate-700 opacity-50";
  };

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center">
          <CardTitle>{quiz.title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div 
              className="radial-progress text-primary" 
              style={{ 
                '--value': Math.round(((currentQuestionIndex + 1) / questions.length) * 100), 
                '--size': '2rem',
                '--thickness': '3px'
              } as React.CSSProperties} 
              role="progressbar"
            >
              {currentQuestionIndex + 1}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">{currentQuestion.questionText}</h3>
          
          {currentQuestion.code && (
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6 overflow-x-auto">
              <code>{currentQuestion.code}</code>
            </pre>
          )}
          
          <RadioGroup value={selectedAnswer} className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center p-3 rounded-md border transition-colors ${getAnswerClass(option)}`}
                onClick={() => handleAnswerSelect(option)}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  disabled={isAnswerSubmitted}
                  className="mr-3"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left mr-2"></i> Previous
            </Button>
            
            {isAnswerSubmitted ? (
              <Button onClick={handleNext}>
                {currentQuestionIndex < questions.length - 1 ? (
                  <>Next <i className="fas fa-arrow-right ml-2"></i></>
                ) : (
                  <>Finish Quiz</>
                )}
              </Button>
            ) : (
              <Button onClick={checkAnswer} disabled={!selectedAnswer}>
                Check Answer
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActiveQuiz;
