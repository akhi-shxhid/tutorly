import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizProps {
  quiz: {
    id: number;
    title: string;
    description?: string;
    questionCount: number;
    timeEstimate: number;
    status: 'new' | 'in_progress' | 'completed';
    progress: number;
    score?: number;
  };
  onStart: () => void;
}

const QuizCard = ({ quiz, onStart }: QuizProps) => {
  const getStatusBadge = () => {
    switch (quiz.status) {
      case 'new':
        return <Badge className="bg-amber-500">New</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const getButtonText = () => {
    switch (quiz.status) {
      case 'new':
        return 'Start Quiz';
      case 'in_progress':
        return 'Continue';
      case 'completed':
        return 'Retry Quiz';
      default:
        return 'Start Quiz';
    }
  };
  
  return (
    <Card>
      <CardBody>
        <h2 className="card-title flex justify-between items-center">
          {quiz.title}
          {getStatusBadge()}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {quiz.questionCount} questions · ~{quiz.timeEstimate} min
        </p>
        <p className="text-sm mt-2">
          {quiz.description || "No description provided"}
        </p>
        <div className="flex justify-between items-center mt-4">
          {quiz.status === 'completed' && typeof quiz.score === 'number' ? (
            <div className="text-success font-bold">Score: {quiz.score}%</div>
          ) : quiz.status === 'in_progress' ? (
            <div>Progress: {quiz.progress}/{quiz.questionCount}</div>
          ) : (
            <div></div>
          )}
          <Button onClick={onStart} variant={quiz.status === 'completed' ? 'outline' : 'default'}>
            {getButtonText()}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default QuizCard;
