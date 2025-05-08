import { useState, useRef, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onClose: () => void;
}

interface SelectedFile {
  file: File;
  tags: string[];
}

const DocumentUpload = ({ onClose }: DocumentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiRequest('/api/documents', 
        {
          method: 'POST',
          body: formData,
        } as any
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.uid, 'documents'] });
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newSelectedFiles: SelectedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      newSelectedFiles.push({
        file: files[i],
        tags: [...currentTags], // Apply current tags to new files
      });
    }
    
    setSelectedFiles([...selectedFiles, ...newSelectedFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (!currentTags.includes(newTag)) {
      setCurrentTags([...currentTags, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setCurrentTags(currentTags.filter(t => t !== tag));
  };

  const handleAddTagToFile = (fileIndex: number, tag: string) => {
    const newFiles = [...selectedFiles];
    if (!newFiles[fileIndex].tags.includes(tag)) {
      newFiles[fileIndex].tags = [...newFiles[fileIndex].tags, tag];
      setSelectedFiles(newFiles);
    }
  };

  const handleRemoveTagFromFile = (fileIndex: number, tag: string) => {
    const newFiles = [...selectedFiles];
    newFiles[fileIndex].tags = newFiles[fileIndex].tags.filter(t => t !== tag);
    setSelectedFiles(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!user || selectedFiles.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (const selectedFile of selectedFiles) {
        const formData = new FormData();
        formData.append('file', selectedFile.file);
        formData.append('userId', user.uid);
        formData.append('tags', JSON.stringify(selectedFile.tags));
        
        try {
          await uploadMutation.mutateAsync(formData);
          successCount++;
        } catch (error) {
          console.error('Error uploading file:', error);
          errorCount++;
        }
      }
      
      // Show toast with success/error count
      if (successCount > 0) {
        toast({
          title: `${successCount} ${successCount === 1 ? 'file' : 'files'} uploaded successfully`,
          variant: "default",
        });
      }
      
      if (errorCount > 0) {
        toast({
          title: `${errorCount} ${errorCount === 1 ? 'file' : 'files'} failed to upload`,
          variant: "destructive",
        });
      }
      
      // Close modal if at least one file was uploaded successfully
      if (successCount > 0) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogDescription>
          Upload files to create summaries and generate learning materials.
        </DialogDescription>
      </DialogHeader>
      
      <div className="my-4 space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Files</label>
          <Input
            ref={fileInputRef}
            type="file"
            className="cursor-pointer"
            multiple
            onChange={handleFileChange}
          />
        </div>
        
        {/* Tags Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Add Tags</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add a tag (e.g., 'python', 'lecture')"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            <Button onClick={handleAddTag} type="button">Add</Button>
          </div>
          
          {/* Current Tags */}
          {currentTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 w-4 h-4 inline-flex items-center justify-center"
                  >
                    <i className="fas fa-times text-[10px]"></i>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {selectedFiles.map((selectedFile, index) => (
                <div key={index} className="bg-slate-100 dark:bg-slate-800 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div className="truncate max-w-[70%]">
                      <span className="font-medium">{selectedFile.file.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(selectedFile.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                  
                  {/* File Tags */}
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedFile.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs flex items-center gap-1">
                          {tag}
                          <button 
                            onClick={() => handleRemoveTagFromFile(index, tag)}
                            className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 w-4 h-4 inline-flex items-center justify-center"
                          >
                            <i className="fas fa-times text-[10px]"></i>
                          </button>
                        </Badge>
                      ))}
                      {/* Add current tags that aren't already on the file */}
                      {currentTags
                        .filter(tag => !selectedFile.tags.includes(tag))
                        .map((tag, tagIndex) => (
                          <Badge 
                            key={`add-${tagIndex}`} 
                            variant="outline" 
                            className="text-xs flex items-center gap-1 border-dashed cursor-pointer"
                            onClick={() => handleAddTagToFile(index, tag)}
                          >
                            <i className="fas fa-plus text-[10px]"></i> {tag}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
          {isUploading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i> Uploading...
            </>
          ) : (
            <>
              <i className="fas fa-upload mr-2"></i> Upload
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default DocumentUpload;