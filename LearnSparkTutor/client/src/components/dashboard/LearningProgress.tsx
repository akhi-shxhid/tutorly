import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const courseTracks = [
  {
    title: "Python Advanced",
    status: "in_progress",
    modules: 12,
    completed: 7,
    progress: 58
  },
  {
    title: "JavaScript ES6+",
    status: "new",
    modules: 10,
    completed: 2,
    progress: 20
  },
  {
    title: "Machine Learning Basics",
    status: "completed",
    modules: 10,
    completed: 10,
    progress: 100
  }
];

const LearningProgress = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-primary">In Progress</Badge>;
      case 'new':
        return <Badge className="bg-amber-500">New</Badge>;
      case 'completed':
        return <Badge className="bg-success">Completed</Badge>;
      default:
        return null;
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className="mb-8">
      <CardBody>
        <CardTitle className="mb-4">Your Learning Progress</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courseTracks.map((track, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{track.title}</h3>
                {getStatusBadge(track.status)}
              </div>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                <i className="fas fa-book-open mr-2"></i> {track.completed}/{track.modules} modules completed
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                <div 
                  className={`${getProgressBarColor(track.status)} h-2.5 rounded-full`} 
                  style={{ width: `${track.progress}%` }}
                ></div>
              </div>
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant={track.status === 'completed' ? 'outline' : 'default'}
                >
                  {track.status === 'completed' ? 'Review Material' : 'Continue Learning'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default LearningProgress;
