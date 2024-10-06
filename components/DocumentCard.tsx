import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { BookOpen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

interface Document {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  content: string;
}

interface DocumentCardProps {
  document: Document;
  viewMode: 'grid' | 'list';
  onDelete: () => void;
  onOpen: () => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, viewMode, onDelete, onOpen }) => {
  const router = useRouter();
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80';

  const handleOpen = () => {
    router.push(`/edit/${document.id}`);
  };

  // Calculate reading progress (this is a simple example, you might want to implement a more sophisticated method)
  const wordCount = document.content.split(/\s+/).length;
  const progress = Math.min(Math.round((wordCount / 1000) * 100), 100); // Assuming 1000 words is 100% progress

  if (viewMode === 'list') {
    return (
      <Card className="flex items-center overflow-hidden transition-all duration-300 hover:shadow-lg book-card">
        <div className="relative w-24 h-36">
          <Image
            src={document.coverUrl || fallbackImageUrl}
            alt={`Cover of ${document.title} by ${document.author}`}
            fill
            sizes="(max-width: 96px) 100vw, 96px"
            className="rounded-l-lg object-cover"
            priority
          />
        </div>
        <div className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold text-accent mb-1">{document.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{document.author}</p>
          <div className="mt-2">
            <Progress value={progress} className="w-full" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        </div>
        <CardFooter>
          <div className="space-x-2">
            <Button onClick={handleOpen} variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
              <BookOpen className="h-4 w-4 mr-2" />
              Open
            </Button>
            <DeleteConfirmDialog onConfirm={onDelete}>
              <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DeleteConfirmDialog>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg book-card">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={document.coverUrl || fallbackImageUrl}
            alt={`Cover of ${document.title} by ${document.author}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold text-accent mb-1">{document.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{document.author}</p>
        <div className="mt-2">
          <Progress value={progress} className="w-full" />
          <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button onClick={handleOpen} variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
          <BookOpen className="h-4 w-4 mr-2" />
          Open
        </Button>
        <DeleteConfirmDialog onConfirm={onDelete}>
          <Button variant="outline" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </DeleteConfirmDialog>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;