import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const DocumentContext = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  // Fetch active documents from API
  const { data: documents } = useQuery({
    queryKey: ['/api/users', user?.uid, 'documents'],
    enabled: !!user?.uid,
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Implement file upload logic
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = async (files: FileList) => {
    // This is a placeholder for actual file upload logic
    // In a real implementation, you would:
    // 1. Upload the file to Firebase Storage
    // 2. Create a document entry in the database
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "File upload simulation",
        description: "This is a placeholder for actual file upload functionality",
      });
    }, 2000);
  };

  const handleRemoveDocument = (documentId: number) => {
    // Implement document removal logic
  };

  const handleGenerateResource = (resourceType: string) => {
    // Implement resource generation logic
    toast({
      title: `Generate ${resourceType}`,
      description: `This is a placeholder for ${resourceType} generation functionality`,
    });
  };

  // Sample active documents
  const activeDocuments = [
    {
      id: 1,
      name: "Python_Advanced_Guide.pdf",
      size: "2.3 MB",
      type: "pdf",
      addedDays: 2,
    },
    {
      id: 2,
      name: "Lecture_Notes_Week3.docx",
      size: "1.1 MB",
      type: "docx",
      addedDays: 0,
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <i className="fas fa-file-pdf"></i>;
      case 'docx':
        return <i className="fas fa-file-word"></i>;
      case 'txt':
        return <i className="fas fa-file-alt"></i>;
      default:
        return <i className="fas fa-file"></i>;
    }
  };

  const getDocumentColorClass = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-300';
      case 'docx':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300';
      case 'txt':
        return 'bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <CardTitle>Learning Context</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Upload documents to provide context for your AI tutor.
          </p>
          
          <div 
            className={`border-2 border-dashed ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-slate-300 dark:border-slate-600'
            } rounded-lg p-6 text-center mt-4 transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 dark:text-slate-500"></i>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Drag and drop files here or
            </p>
            <label className="inline-block">
              <Button variant="outline" size="sm" className="mt-2">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <span className="animate-spin">
                      <i className="fas fa-spinner"></i>
                    </span>
                    Uploading...
                  </div>
                ) : (
                  'Browse Files'
                )}
              </Button>
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt" 
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
              />
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              PDF, DOCX, TXT (Max 10MB)
            </p>
          </div>
        </CardBody>
      </Card>
      
      {/* Active Documents */}
      <Card>
        <CardBody>
          <CardTitle>Active Documents</CardTitle>
          
          <div className="mt-4 space-y-3">
            {activeDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600">
                <div className={`w-8 h-8 rounded ${getDocumentColorClass(doc.type)} flex items-center justify-center`}>
                  {getDocumentIcon(doc.type)}
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.size} · Added {doc.addedDays === 0 ? 'today' : `${doc.addedDays} days ago`}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.id)}>
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            ))}
            
            {activeDocuments.length === 0 && (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                <p>No active documents</p>
                <p className="text-xs mt-1">Upload documents to enhance your learning experience</p>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <h3 className="font-bold text-sm">Generate Learning Resources</h3>
          <div className="mt-2 space-y-2">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => handleGenerateResource('Flashcards')}
            >
              <i className="fas fa-magic mr-2"></i> Create Flashcards
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => handleGenerateResource('Quiz')}
            >
              <i className="fas fa-question-circle mr-2"></i> Generate Quiz
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => handleGenerateResource('Summary')}
            >
              <i className="fas fa-file-alt mr-2"></i> Summarize Content
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DocumentContext;
