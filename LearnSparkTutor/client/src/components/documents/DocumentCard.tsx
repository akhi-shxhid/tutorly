import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface DocumentProps {
  document: {
    id: number;
    name: string;
    type: string;
    size: number;
    tags?: string[];
    uploadedAt: string;
    url: string;
  };
  onDelete?: (id: number) => void;
}

const DocumentCard = ({ document, onDelete }: DocumentProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word') || type.includes('doc')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('sheet') || type.includes('csv')) return 'fa-file-excel';
    if (type.includes('ppt') || type.includes('presentation')) return 'fa-file-powerpoint';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return 'fa-file-image';
    if (type.includes('text')) return 'fa-file-alt';
    return 'fa-file';
  };
  
  const getFileIconColor = (type: string) => {
    if (type.includes('pdf')) return 'text-red-500';
    if (type.includes('word') || type.includes('doc')) return 'text-blue-500';
    if (type.includes('excel') || type.includes('sheet') || type.includes('csv')) return 'text-green-500';
    if (type.includes('ppt') || type.includes('presentation')) return 'text-orange-500';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return 'text-purple-500';
    if (type.includes('text')) return 'text-slate-500';
    return 'text-slate-400';
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete(document.id);
      }
      toast({
        title: "Document deleted",
        description: `${document.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting document",
        description: "There was an error deleting this document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // For timestamp handling - assume it's either a string or ISO date
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  const handleGenerateContent = (type: string) => {
    toast({
      title: "Generating content",
      description: `AI is analyzing this document to create learning materials.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3 border-b">
        <div className={`text-3xl ${getFileIconColor(document.type)}`}>
          <i className={`fas ${getFileIcon(document.type)}`}></i>
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="font-medium text-lg truncate" title={document.name}>
            {document.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {document.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {(!document.tags || document.tags.length === 0) && (
            <span className="text-sm text-slate-500 dark:text-slate-400">No tags</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t flex justify-between">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(document.url, '_blank')}
          >
            <i className="fas fa-external-link-alt mr-1"></i> Open
          </Button>
          <Button 
            size="sm" 
            variant="default"
            onClick={() => handleGenerateContent(document.type)}
          >
            <i className="fas fa-magic mr-1"></i> Generate
          </Button>
        </div>
        
        {onDelete && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-trash-alt"></i>}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;