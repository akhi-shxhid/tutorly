import { useState } from 'react';
import ChatInterface from '@/components/ai-tutor/ChatInterface';
import DocumentContext from '@/components/ai-tutor/DocumentContext';
import { Button } from '@/components/ui/button';

const AITutor = () => {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportConversation = () => {
    setExportLoading(true);
    setTimeout(() => {
      // Simulating export functionality
      setExportLoading(false);
    }, 1000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">AI Tutor</h1>
        <Button 
          variant="outline" 
          className="mt-4 md:mt-0"
          onClick={handleExportConversation}
          disabled={exportLoading}
        >
          {exportLoading ? (
            <>
              <span className="animate-spin mr-2">
                <i className="fas fa-spinner"></i>
              </span>
              Exporting...
            </>
          ) : (
            <>
              <i className="fas fa-download mr-2"></i> Export Conversation
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="col-span-1 lg:col-span-2">
          <ChatInterface />
        </div>
        
        {/* Context/Resources Section */}
        <div className="col-span-1">
          <DocumentContext />
        </div>
      </div>
    </div>
  );
};

export default AITutor;
