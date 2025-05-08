import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentUpload from '@/components/documents/DocumentUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const Summaries = () => {
  const { user } = useAuth();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/users', user?.uid, 'documents'],
    enabled: !!user?.uid,
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/documents/${id}`, 
        { method: 'DELETE' } as any
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.uid, 'documents'] });
    },
  });

  const handleDeleteDocument = async (id: number) => {
    await deleteDocumentMutation.mutate(id);
  };

  const isLoaded = !isLoading;
  const allDocuments = documents || [];
  
  // Filter documents based on search term
  const filteredDocuments = allDocuments && Array.isArray(allDocuments) 
    ? allDocuments.filter((doc: any) => 
        doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.tags && Array.isArray(doc.tags) && doc.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : [];
  
  const pdfDocuments = filteredDocuments.filter((doc: any) => doc.type.includes('pdf'));
  const textDocuments = filteredDocuments.filter((doc: any) => doc.type.includes('text'));
  const imageDocuments = filteredDocuments.filter((doc: any) => 
    doc.type.includes('image') || doc.type.includes('jpg') || doc.type.includes('png')
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="pt-4"
    >
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        variants={item}
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">Summaries</h1>
          <p className="text-slate-500 dark:text-slate-400">Upload and analyze your learning materials</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 flex items-center bg-primary hover:bg-primary/90 text-white shadow-md">
              <i className="fas fa-plus mr-2"></i> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DocumentUpload onClose={() => setUploadDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={item} className="mb-6">
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
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({filteredDocuments.length})</TabsTrigger>
            <TabsTrigger value="pdf">PDFs ({pdfDocuments.length})</TabsTrigger>
            <TabsTrigger value="text">Text ({textDocuments.length})</TabsTrigger>
            <TabsTrigger value="image">Images ({imageDocuments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoaded && filteredDocuments.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No documents found</CardTitle>
                  <CardDescription>
                    {searchTerm 
                      ? "Try adjusting your search terms" 
                      : "Upload documents to generate summaries and learning materials"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                    <i className="fas fa-upload mr-2"></i> Upload your first document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-40 bg-slate-200 dark:bg-slate-700"></div>
                      <CardContent className="p-4">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredDocuments.map((document: any) => (
                    <motion.div key={document.id} variants={item} className="card-hover">
                      <DocumentCard 
                        document={document} 
                        onDelete={() => handleDeleteDocument(document.id)}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pdf" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfDocuments.length === 0 ? (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No PDF documents</CardTitle>
                    <CardDescription>
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Upload PDF files to generate summaries and learning materials"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                pdfDocuments.map((document: any) => (
                  <motion.div key={document.id} variants={item} className="card-hover">
                    <DocumentCard 
                      document={document} 
                      onDelete={() => handleDeleteDocument(document.id)} 
                    />
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textDocuments.length === 0 ? (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No text documents</CardTitle>
                    <CardDescription>
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Upload text files to generate summaries and learning materials"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                textDocuments.map((document: any) => (
                  <motion.div key={document.id} variants={item} className="card-hover">
                    <DocumentCard 
                      document={document} 
                      onDelete={() => handleDeleteDocument(document.id)} 
                    />
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="image" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageDocuments.length === 0 ? (
                <Card className="col-span-full">
                  <CardHeader>
                    <CardTitle>No image documents</CardTitle>
                    <CardDescription>
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Upload images to generate summaries and learning materials"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                imageDocuments.map((document: any) => (
                  <motion.div key={document.id} variants={item} className="card-hover">
                    <DocumentCard 
                      document={document} 
                      onDelete={() => handleDeleteDocument(document.id)} 
                    />
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Summaries;