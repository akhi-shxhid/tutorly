import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentUpload from '@/components/documents/DocumentUpload';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const Documents = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/users', user?.uid, 'documents'],
    enabled: !!user?.uid,
  });

  const filteredDocuments = documents
    ? documents.filter((doc: any) => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags && doc.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : [];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Documents</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={() => setShowUploadModal(true)}>
            <i className="fas fa-plus mr-2"></i> Upload Document
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <i className="fas fa-filter"></i>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Documents</DropdownMenuItem>
              <DropdownMenuItem>PDFs</DropdownMenuItem>
              <DropdownMenuItem>Notes</DropdownMenuItem>
              <DropdownMenuItem>Recently Added</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="form-control mb-6">
        <div className="flex">
          <Input
            type="text"
            placeholder="Search documents..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button className="ml-2">
            <i className="fas fa-search"></i>
          </Button>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="card bg-base-100 dark:bg-slate-700 shadow-xl animate-pulse">
              <div className="card-body">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-lg"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-5 bg-slate-200 dark:bg-slate-600 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-600 rounded"></div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-600 mt-4 pt-4">
                  <div className="flex justify-between">
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredDocuments && filteredDocuments.length > 0 ? (
          filteredDocuments.map((document: any) => (
            <DocumentCard key={document.id} document={document} />
          ))
        ) : (
          <div className="col-span-1 md:col-span-3 text-center py-12">
            <div className="mb-4 text-4xl text-slate-400">
              <i className="fas fa-file-alt"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Upload your first document to get started"}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <i className="fas fa-plus mr-2"></i> Upload Document
            </Button>
          </div>
        )}
      </div>

      {showUploadModal && (
        <DocumentUpload onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default Documents;
