import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';

interface StudySessionProps {
  deckId: number;
  onClose: () => void;
}

const StudySession = ({ deckId, onClose }: StudySessionProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: deck } = useQuery({
    queryKey: ['/api/flashcard-decks', deckId],
  });
  
  const { data: flashcards, isLoading } = useQuery({
    queryKey: ['/api/flashcard-decks', deckId, 'flashcards'],
  });
  
  // Sample flashcards if the API doesn't return any
  const sampleFlashcards = [
    {
      id: 1,
      question: "What is a Python decorator?",
      answer: "A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.",
      mastered: false
    },
    {
      id: 2,
      question: "What is a closure in JavaScript?",
      answer: "A closure is a function that remembers its outer variables and can access them. In JavaScript, all functions are closures.",
      mastered: false
    },
    {
      id: 3,
      question: "What is the difference between var, let, and const in JavaScript?",
      answer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned but not redeclared, const is block-scoped and cannot be reassigned or redeclared.",
      mastered: true
    }
  ];
  
  const cards = flashcards || sampleFlashcards;
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };
  
  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };
  
  const handleMarkCorrect = async () => {
    if (!cards || cards.length === 0) return;
    
    const currentCard = cards[currentIndex];
    try {
      await apiRequest('PATCH', `/api/flashcards/${currentCard.id}/mastery`, {
        mastered: true
      });
      handleNext();
    } catch (error) {
      console.error('Error marking card as mastered:', error);
    }
  };
  
  const handleMarkIncorrect = async () => {
    if (!cards || cards.length === 0) return;
    
    const currentCard = cards[currentIndex];
    try {
      await apiRequest('PATCH', `/api/flashcards/${currentCard.id}/mastery`, {
        mastered: false
      });
      handleNext();
    } catch (error) {
      console.error('Error marking card as not mastered:', error);
    }
  };
  
  // Handle key presses for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        // Spacebar
        handleFlip();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <CardTitle>Loading Flashcards...</CardTitle>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  const currentFlashcard = cards[currentIndex];
  
  return (
    <Card className="mb-8">
      <CardBody>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>Study Session: {deck?.title || "Flashcards"}</CardTitle>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Card {currentIndex + 1} of {cards.length}
        </p>
        
        {/* Flashcard Component */}
        <div 
          className={`w-full mx-auto max-w-md h-64 cursor-pointer ${isFlipped ? 'flashcard flipped' : 'flashcard'}`} 
          onClick={handleFlip}
        >
          <div className="flashcard-inner relative w-full h-full">
            {/* Front of Card */}
            <div className="flashcard-front absolute w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 flex items-center justify-center shadow-md">
              <div className="text-center">
                <h3 className="font-bold text-xl mb-4">{currentFlashcard.question}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Click to reveal answer</p>
              </div>
            </div>
            
            {/* Back of Card */}
            <div className="flashcard-back absolute w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl p-6 flex items-center justify-center shadow-md">
              <div className="text-center">
                <p>{currentFlashcard.answer}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Controls */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={handlePrev}>
            <i className="fas fa-arrow-left mr-2"></i> Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10" onClick={handleMarkIncorrect}>
              <i className="fas fa-times mr-2"></i> Incorrect
            </Button>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleMarkCorrect}>
              <i className="fas fa-check mr-2"></i> Correct
            </Button>
          </div>
          <Button variant="outline" onClick={handleNext}>
            Next <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default StudySession;
