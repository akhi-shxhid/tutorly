import { useState, useRef, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
    timestamp: new Date(),
  },
];

const SAMPLE_SUGGESTIONS = [
  "Explain generators",
  "Create a Python quiz",
  "Help debug my code"
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai/chat', {
        message: input,
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(data.timestamp),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to get response",
        description: "There was an error processing your message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardBody className="p-0">
        {/* Chat Header */}
        <div className="border-b border-slate-200 dark:border-slate-600 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <i className="fas fa-robot"></i>
            </div>
            <div className="ml-3">
              <h3 className="font-bold">SparkBot</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI Learning Assistant</p>
            </div>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <i className="fas fa-ellipsis-vertical"></i>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <i className="fas fa-trash-alt mr-2"></i> Clear Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <i className="fas fa-cog mr-2"></i> AI Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <i className="fas fa-history mr-2"></i> View History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`chat ${message.role === 'assistant' ? 'chat-start' : 'chat-end'} mb-4`}
            >
              <div className="chat-image avatar">
                <div className={`w-10 h-10 rounded-full ${
                  message.role === 'assistant' 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-white'
                } flex items-center justify-center`}>
                  <i className={`fas ${message.role === 'assistant' ? 'fa-robot' : 'fa-user'}`}></i>
                </div>
              </div>
              <div className={`chat-bubble ${
                message.role === 'assistant' 
                  ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100' 
                  : 'bg-primary text-white'
              }`}>
                {message.content.split('\n').map((text, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>{text}</p>
                ))}
              </div>
              <div className="chat-footer opacity-50 text-xs flex gap-1 items-center mt-1">
                <span>{formatMessageTime(message.timestamp)}</span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="chat chat-start mb-4">
              <div className="chat-image avatar">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <i className="fas fa-robot"></i>
                </div>
              </div>
              <div className="chat-bubble bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="border-t border-slate-200 dark:border-slate-600 p-4">
          <div className="flex items-center">
            <Button variant="ghost" className="btn-circle mr-2">
              <i className="fas fa-paperclip"></i>
            </Button>
            <Input 
              placeholder="Ask anything..." 
              className="flex-grow"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <Button 
              className="ml-2"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SAMPLE_SUGGESTIONS.map((suggestion, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                size="sm"
                className="bg-slate-100 dark:bg-slate-800 text-xs"
                onClick={() => useSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ChatInterface;
