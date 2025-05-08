import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FlashcardDeckProps {
  deck: {
    id: number;
    title: string;
    description?: string;
    cardCount: number;
    progress: number;
  };
  onStudy: () => void;
}

const FlashcardDeck = ({ deck, onStudy }: FlashcardDeckProps) => {
  return (
    <Card>
      <CardBody>
        <h2 className="card-title flex justify-between items-center">
          {deck.title}
          <Badge className="bg-primary">{deck.cardCount} cards</Badge>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {deck.description || "No description provided"}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div 
            className="radial-progress text-primary" 
            style={{ 
              '--value': deck.progress, 
              '--size': '2.5rem',
              '--thickness': '3px'
            } as React.CSSProperties} 
            role="progressbar"
          >
            {deck.progress}%
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={onStudy}>
              Study
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <i className="fas fa-ellipsis-vertical"></i>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <i className="fas fa-edit mr-2"></i> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="fas fa-share-alt mr-2"></i> Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 dark:text-red-400">
                  <i className="fas fa-trash-alt mr-2"></i> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default FlashcardDeck;
