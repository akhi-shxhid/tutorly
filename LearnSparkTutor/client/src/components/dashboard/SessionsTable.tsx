import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface StudySession {
  id: number;
  topic: string;
  date: string;
  duration: number;
  resources: string[];
}

interface SessionsTableProps {
  sessions: StudySession[];
  isLoading: boolean;
}

const SAMPLE_SESSIONS = [
  {
    id: 1,
    topic: "Neural Networks Architecture",
    date: "Oct 12, 2023",
    duration: 80, // in minutes
    resources: ["PDF", "Flashcards"]
  },
  {
    id: 2,
    topic: "React Hooks Deep Dive",
    date: "Oct 10, 2023",
    duration: 45, // in minutes
    resources: ["Notes", "Quiz"]
  },
  {
    id: 3,
    topic: "Cloud Computing Fundamentals",
    date: "Oct 8, 2023",
    duration: 125, // in minutes
    resources: ["PDF", "Notes"]
  }
];

const SessionsTable = ({ sessions = SAMPLE_SESSIONS, isLoading }: SessionsTableProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Recent Study Sessions</CardTitle>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <TableRow key={session.id} className="hover">
                    <TableCell>{session.topic}</TableCell>
                    <TableCell>{session.date}</TableCell>
                    <TableCell>{formatDuration(session.duration)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {session.resources.map((resource, idx) => (
                          <Badge key={idx} variant="outline" className="mr-1">{resource}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No study sessions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default SessionsTable;
