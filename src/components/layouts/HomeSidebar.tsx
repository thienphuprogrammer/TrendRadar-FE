import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import useHomeSidebar from '@/hooks/useHomeSidebar';
import { LoadingWrapper, ListSkeleton } from '@/components/common/feedback/LoadingStates';
import { formatDistanceToNow } from 'date-fns';

interface HomeSidebarProps {
  selectedThreadId?: string;
  onThreadSelect?: (threadId: string) => void;
}

export function HomeSidebar({ selectedThreadId, onThreadSelect }: HomeSidebarProps) {
  const router = useRouter();
  const { data: { threads }, loading, deleteThread, isDeleting } = useHomeSidebar();

  const handleNewConversation = () => {
    router.push('/home');
  };

  const handleThreadClick = (threadId: string) => {
    if (onThreadSelect) {
      onThreadSelect(threadId);
    } else {
      router.push(`/home/${threadId}`);
    }
  };

  const handleDeleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteThread(threadId);
    }
  };

  return (
    <div className="w-80 border-r bg-background/95 backdrop-blur-sm flex flex-col h-full shadow-sm">
      {/* Header with gradient */}
      <div className="p-6 border-b bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Conversations
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Your AI interactions</p>
          </div>
          <Button size="sm" onClick={handleNewConversation} className="shadow-sm hover:shadow-md transition-shadow">
            <Plus className="h-4 w-4 mr-1.5" />
            New
          </Button>
        </div>
        
        {/* Quick Stats with modern design */}
        <div className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">{threads.length}</span>
            <span className="text-xs">threads</span>
          </div>
        </div>
      </div>

      {/* Threads List with enhanced styling */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {loading ? (
            <ListSkeleton count={5} />
          ) : threads.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl mb-4">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-2">No conversations yet</h3>
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Start a new conversation to explore your data with AI
                </p>
                <Button size="sm" onClick={handleNewConversation} className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Start Conversation
                </Button>
              </div>
            ) : (
              threads.map((thread: any) => (
                <Card
                  key={thread.id}
                  className={`group cursor-pointer transition-all duration-200 border ${
                    selectedThreadId === thread.id
                      ? 'ring-2 ring-primary bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 shadow-md'
                      : 'hover:bg-muted/50 hover:shadow-md hover:border-primary/20'
                  }`}
                  onClick={() => handleThreadClick(thread.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="text-sm font-semibold truncate mb-1">
                          {thread.title}
                        </h4>
                        {thread.lastMessage && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {thread.lastMessage.content}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => handleDeleteThread(thread.id, e)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {thread.lastMessage
                            ? formatDistanceToNow(new Date(thread.lastMessage.createdAt), { addSuffix: true })
                            : formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })
                          }
                        </span>
                      </div>
                      {selectedThreadId === thread.id && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
        </div>
      </ScrollArea>

      {/* Footer with branding */}
      <div className="p-4 border-t bg-gradient-to-t from-muted/20 to-transparent">
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-foreground">TrendRadar AI</p>
          <p className="text-xs text-muted-foreground">Powered by advanced analytics</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
