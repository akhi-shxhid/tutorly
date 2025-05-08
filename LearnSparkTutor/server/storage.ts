import {
  User,
  InsertUser,
  StudySession,
  InsertStudySession,
  Document,
  InsertDocument,
  FlashcardDeck,
  InsertFlashcardDeck,
  Flashcard,
  InsertFlashcard,
  Quiz,
  InsertQuiz,
  QuizQuestion,
  InsertQuizQuestion,
  ChatConversation,
  InsertChatConversation,
  ChatMessage,
  InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Study Session operations
  getStudySessions(userId: number): Promise<StudySession[]>;
  getStudySession(id: number): Promise<StudySession | undefined>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  
  // Document operations
  getDocuments(userId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Flashcard Deck operations
  getFlashcardDecks(userId: number): Promise<FlashcardDeck[]>;
  getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined>;
  createFlashcardDeck(deck: InsertFlashcardDeck): Promise<FlashcardDeck>;
  updateFlashcardDeckProgress(id: number, progress: number): Promise<FlashcardDeck>;
  
  // Flashcard operations
  getFlashcards(deckId: number): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcardMastery(id: number, mastered: boolean): Promise<Flashcard>;
  
  // Quiz operations
  getQuizzes(userId: number): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuizProgress(id: number, progress: number, score?: number): Promise<Quiz>;
  
  // Quiz Question operations
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  
  // Chat operations
  getChatConversations(userId: number): Promise<ChatConversation[]>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  
  // Chat Message operations
  getChatMessages(conversationId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studySessions: Map<number, StudySession>;
  private documents: Map<number, Document>;
  private flashcardDecks: Map<number, FlashcardDeck>;
  private flashcards: Map<number, Flashcard>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private chatConversations: Map<number, ChatConversation>;
  private chatMessages: Map<number, ChatMessage>;
  
  private userId: number;
  private sessionId: number;
  private documentId: number;
  private deckId: number;
  private flashcardId: number;
  private quizId: number;
  private questionId: number;
  private conversationId: number;
  private messageId: number;
  
  constructor() {
    this.users = new Map();
    this.studySessions = new Map();
    this.documents = new Map();
    this.flashcardDecks = new Map();
    this.flashcards = new Map();
    this.quizzes = new Map();
    this.quizQuestions = new Map();
    this.chatConversations = new Map();
    this.chatMessages = new Map();
    
    this.userId = 1;
    this.sessionId = 1;
    this.documentId = 1;
    this.deckId = 1;
    this.flashcardId = 1;
    this.quizId = 1;
    this.questionId = 1;
    this.conversationId = 1;
    this.messageId = 1;
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Study Session operations
  async getStudySessions(userId: number): Promise<StudySession[]> {
    return Array.from(this.studySessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async getStudySession(id: number): Promise<StudySession | undefined> {
    return this.studySessions.get(id);
  }
  
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const id = this.sessionId++;
    const newSession: StudySession = { ...session, id };
    this.studySessions.set(id, newSession);
    return newSession;
  }
  
  // Document operations
  async getDocuments(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId)
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const newDocument: Document = { ...document, id, uploadedAt: new Date() };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Flashcard Deck operations
  async getFlashcardDecks(userId: number): Promise<FlashcardDeck[]> {
    return Array.from(this.flashcardDecks.values())
      .filter(deck => deck.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getFlashcardDeck(id: number): Promise<FlashcardDeck | undefined> {
    return this.flashcardDecks.get(id);
  }
  
  async createFlashcardDeck(deck: InsertFlashcardDeck): Promise<FlashcardDeck> {
    const id = this.deckId++;
    const newDeck: FlashcardDeck = { ...deck, id, createdAt: new Date() };
    this.flashcardDecks.set(id, newDeck);
    return newDeck;
  }
  
  async updateFlashcardDeckProgress(id: number, progress: number): Promise<FlashcardDeck> {
    const deck = this.flashcardDecks.get(id);
    if (!deck) throw new Error(`Flashcard deck with id ${id} not found`);
    
    const updatedDeck = { ...deck, progress };
    this.flashcardDecks.set(id, updatedDeck);
    return updatedDeck;
  }
  
  // Flashcard operations
  async getFlashcards(deckId: number): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values()).filter(card => card.deckId === deckId);
  }
  
  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.flashcardId++;
    const newFlashcard: Flashcard = { ...flashcard, id };
    this.flashcards.set(id, newFlashcard);
    return newFlashcard;
  }
  
  async updateFlashcardMastery(id: number, mastered: boolean): Promise<Flashcard> {
    const flashcard = this.flashcards.get(id);
    if (!flashcard) throw new Error(`Flashcard with id ${id} not found`);
    
    const updatedFlashcard = { ...flashcard, mastered };
    this.flashcards.set(id, updatedFlashcard);
    return updatedFlashcard;
  }
  
  // Quiz operations
  async getQuizzes(userId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter(quiz => quiz.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const id = this.quizId++;
    const newQuiz: Quiz = { ...quiz, id, createdAt: new Date() };
    this.quizzes.set(id, newQuiz);
    return newQuiz;
  }
  
  async updateQuizProgress(id: number, progress: number, score?: number): Promise<Quiz> {
    const quiz = this.quizzes.get(id);
    if (!quiz) throw new Error(`Quiz with id ${id} not found`);
    
    const status = progress === quiz.questionCount ? 'completed' : 'in_progress';
    const updatedQuiz: Quiz = { 
      ...quiz, 
      progress, 
      status,
      ...(score !== undefined && { score })
    };
    
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }
  
  // Quiz Question operations
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(question => question.quizId === quizId);
  }
  
  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.questionId++;
    const newQuestion: QuizQuestion = { ...question, id };
    this.quizQuestions.set(id, newQuestion);
    return newQuestion;
  }
  
  // Chat operations
  async getChatConversations(userId: number): Promise<ChatConversation[]> {
    return Array.from(this.chatConversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    return this.chatConversations.get(id);
  }
  
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const id = this.conversationId++;
    const newConversation: ChatConversation = { ...conversation, id, createdAt: new Date() };
    this.chatConversations.set(id, newConversation);
    return newConversation;
  }
  
  // Chat Message operations
  async getChatMessages(conversationId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.messageId++;
    const newMessage: ChatMessage = { ...message, id, timestamp: new Date() };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
