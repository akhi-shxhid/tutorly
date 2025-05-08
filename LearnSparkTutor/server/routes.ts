import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertUserSchema,
  insertStudySessionSchema,
  insertDocumentSchema,
  insertFlashcardDeckSchema,
  insertFlashcardSchema,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertChatConversationSchema,
  insertChatMessageSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUid(userData.uid);
      
      if (existingUser) {
        return res.json(existingUser);
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:uid", async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      const user = await storage.getUserByUid(uid);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Study Session routes
  app.get("/api/users/:userId/study-sessions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getStudySessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get study sessions" });
    }
  });

  app.post("/api/study-sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create study session" });
      }
    }
  });

  // Document routes
  app.get("/api/users/:userId/documents", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to get documents" });
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create document" });
      }
    }
  });

  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDocument(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Flashcard Deck routes
  app.get("/api/users/:userId/flashcard-decks", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const decks = await storage.getFlashcardDecks(userId);
      res.json(decks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flashcard decks" });
    }
  });

  app.post("/api/flashcard-decks", async (req: Request, res: Response) => {
    try {
      const deckData = insertFlashcardDeckSchema.parse(req.body);
      const deck = await storage.createFlashcardDeck(deckData);
      res.status(201).json(deck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create flashcard deck" });
      }
    }
  });

  app.patch("/api/flashcard-decks/:id/progress", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { progress } = req.body;
      
      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
      }
      
      const deck = await storage.updateFlashcardDeckProgress(id, progress);
      res.json(deck);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deck progress" });
    }
  });

  // Flashcard routes
  app.get("/api/flashcard-decks/:deckId/flashcards", async (req: Request, res: Response) => {
    try {
      const deckId = parseInt(req.params.deckId);
      const flashcards = await storage.getFlashcards(deckId);
      res.json(flashcards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get flashcards" });
    }
  });

  app.post("/api/flashcards", async (req: Request, res: Response) => {
    try {
      const flashcardData = insertFlashcardSchema.parse(req.body);
      const flashcard = await storage.createFlashcard(flashcardData);
      res.status(201).json(flashcard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create flashcard" });
      }
    }
  });

  app.patch("/api/flashcards/:id/mastery", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { mastered } = req.body;
      
      if (typeof mastered !== 'boolean') {
        return res.status(400).json({ message: "Mastered must be a boolean" });
      }
      
      const flashcard = await storage.updateFlashcardMastery(id, mastered);
      res.json(flashcard);
    } catch (error) {
      res.status(500).json({ message: "Failed to update flashcard mastery" });
    }
  });

  // Quiz routes
  app.get("/api/users/:userId/quizzes", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const quizzes = await storage.getQuizzes(userId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quizzes" });
    }
  });

  app.post("/api/quizzes", async (req: Request, res: Response) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create quiz" });
      }
    }
  });

  app.patch("/api/quizzes/:id/progress", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { progress, score } = req.body;
      
      if (typeof progress !== 'number' || progress < 0) {
        return res.status(400).json({ message: "Progress must be a non-negative number" });
      }
      
      if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
        return res.status(400).json({ message: "Score must be a number between 0 and 100" });
      }
      
      const quiz = await storage.updateQuizProgress(id, progress, score);
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quiz progress" });
    }
  });

  // Quiz Question routes
  app.get("/api/quizzes/:quizId/questions", async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const questions = await storage.getQuizQuestions(quizId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz questions" });
    }
  });

  app.post("/api/quiz-questions", async (req: Request, res: Response) => {
    try {
      const questionData = insertQuizQuestionSchema.parse(req.body);
      const question = await storage.createQuizQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create quiz question" });
      }
    }
  });

  // Chat Conversation routes
  app.get("/api/users/:userId/chat-conversations", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const conversations = await storage.getChatConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat conversations" });
    }
  });

  app.post("/api/chat-conversations", async (req: Request, res: Response) => {
    try {
      const conversationData = insertChatConversationSchema.parse(req.body);
      const conversation = await storage.createChatConversation(conversationData);
      res.status(201).json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create chat conversation" });
      }
    }
  });

  // Chat Message routes
  app.get("/api/chat-conversations/:conversationId/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.conversationId);
      const messages = await storage.getChatMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat-messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create chat message" });
      }
    }
  });

  // AI Tutor endpoint
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const { message, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // In a real implementation, this would call an AI service like OpenAI or Hugging Face
      // For now, we'll just return a mock response
      const response = {
        role: "assistant",
        content: `I'm your AI tutor. You asked: "${message}". This is a placeholder response. In a real implementation, this would be processed through an AI model.`,
        timestamp: new Date()
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  // Document analysis endpoint
  app.post("/api/ai/analyze-document", async (req: Request, res: Response) => {
    try {
      const { documentId } = req.body;
      
      if (!documentId) {
        return res.status(400).json({ message: "Document ID is required" });
      }
      
      const document = await storage.getDocument(parseInt(documentId));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // In a real implementation, this would process the document through an AI service
      const analysis = {
        summary: "This is a placeholder document summary. In a real implementation, this would be the result of AI processing.",
        keyPoints: [
          "Key point 1 from the document",
          "Key point 2 from the document",
          "Key point 3 from the document"
        ]
      };
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze document" });
    }
  });

  // Generate flashcards from document
  app.post("/api/ai/generate-flashcards", async (req: Request, res: Response) => {
    try {
      const { documentId, userId, deckTitle } = req.body;
      
      if (!documentId || !userId || !deckTitle) {
        return res.status(400).json({ message: "Document ID, User ID, and Deck Title are required" });
      }
      
      // In a real implementation, this would generate flashcards from a document using an AI service
      // For now, we'll create a dummy deck with sample flashcards
      const deck = await storage.createFlashcardDeck({
        userId: parseInt(userId),
        title: deckTitle,
        description: "AI-generated flashcards",
        cardCount: 3,
        progress: 0
      });
      
      const flashcards = [
        await storage.createFlashcard({
          deckId: deck.id,
          question: "Sample question 1?",
          answer: "Sample answer 1",
          mastered: false
        }),
        await storage.createFlashcard({
          deckId: deck.id,
          question: "Sample question 2?",
          answer: "Sample answer 2",
          mastered: false
        }),
        await storage.createFlashcard({
          deckId: deck.id,
          question: "Sample question 3?",
          answer: "Sample answer 3",
          mastered: false
        })
      ];
      
      res.json({ deck, flashcards });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate flashcards" });
    }
  });

  // Generate quiz from document
  app.post("/api/ai/generate-quiz", async (req: Request, res: Response) => {
    try {
      const { documentId, userId, quizTitle } = req.body;
      
      if (!documentId || !userId || !quizTitle) {
        return res.status(400).json({ message: "Document ID, User ID, and Quiz Title are required" });
      }
      
      // In a real implementation, this would generate a quiz from a document using an AI service
      // For now, we'll create a dummy quiz with sample questions
      const quiz = await storage.createQuiz({
        userId: parseInt(userId),
        title: quizTitle,
        description: "AI-generated quiz",
        questionCount: 3,
        timeEstimate: 15,
        status: "new",
        progress: 0
      });
      
      const questions = [
        await storage.createQuizQuestion({
          quizId: quiz.id,
          questionText: "Sample question 1?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        }),
        await storage.createQuizQuestion({
          quizId: quiz.id,
          questionText: "Sample question 2?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option B"
        }),
        await storage.createQuizQuestion({
          quizId: quiz.id,
          questionText: "Sample code question?",
          code: "function example() { return 'test'; }",
          options: ["It returns 'test'", "It throws an error", "It returns undefined", "None of the above"],
          correctAnswer: "It returns 'test'"
        })
      ];
      
      res.json({ quiz, questions });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate quiz" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
