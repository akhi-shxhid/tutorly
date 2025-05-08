import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import FlashcardDeck from '@/components/flashcards/FlashcardDeck';
import StudySession from '@/components/flashcards/StudySession';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Flashcards = () => {
  const { user } = useAuth();
  const [activeStudyDeck, setActiveStudyDeck] = useState<number | null>(null);
  
  const { data: decks, isLoading } = useQuery({
    queryKey: ['/api/users', user?.uid, 'flashcard-decks'],
    enabled: !!user?.uid,
  });

  const handleStudyDeck = (deckId: number) => {
    setActiveStudyDeck(deckId);
  };

  const handleCloseStudySession = () => {
    setActiveStudyDeck(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button>
            <i className="fas fa-plus mr-2"></i> Create Deck
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <i className="fas fa-filter"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Decks</DropdownMenuItem>
              <DropdownMenuItem>Recently Studied</DropdownMenuItem>
              <DropdownMenuItem>Needs Review</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeStudyDeck ? (
        <StudySession deckId={activeStudyDeck} onClose={handleCloseStudySession} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="card bg-base-100 dark:bg-slate-700 shadow-xl animate-pulse">
                <div className="card-body">
                  <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                      <div className="h-8 w-8 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : decks && decks.length > 0 ? (
            decks.map((deck: any) => (
              <FlashcardDeck 
                key={deck.id} 
                deck={deck} 
                onStudy={() => handleStudyDeck(deck.id)} 
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12">
              <div className="mb-4 text-4xl text-slate-400">
                <i className="fas fa-layer-group"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">No flashcard decks yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Create your first deck to start studying!
              </p>
              <Button>
                <i className="fas fa-plus mr-2"></i> Create Deck
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
