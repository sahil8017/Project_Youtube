import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Search, 
  Share, 
  Archive, 
  Trash2, 
  Send, 
  Paperclip, 
  Volume2,
  Menu,
  X,
  Bot,
  User,
  Plus
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'file' | 'youtube'; url: string; name?: string }[];
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive?: boolean;
}

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("query");
  const [queryInput, setQueryInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const [chats] = useState<Chat[]>([
    { id: '1', title: 'Product Roadmap Discussion', lastMessage: 'Sure, I can help you...', timestamp: new Date(Date.now() - 1000 * 60 * 30), isActive: true },
    { id: '2', title: 'React Best Practices', lastMessage: 'Here are some key points...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '3', title: 'YouTube Video Analysis', lastMessage: 'The video discusses...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '4', title: 'API Documentation Help', lastMessage: 'I\'ll explain the endpoints...', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      type: 'user',
      content: 'Can you help me build a modern chat interface for my application?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15)
    },
    {
      id: '2',
      type: 'ai',
      content: 'Absolutely! I\'d be happy to help you build a modern chat interface. Let me break down the key components you\'ll need:\n\n1. **Layout Structure**: A sidebar for navigation, main chat area, and input section\n2. **Message Components**: Styled bubbles for user and AI messages\n3. **Input Handling**: Support for text, files, and multimedia\n4. **Responsive Design**: Works well on all device sizes\n\nWould you like me to start with any specific component?',
      timestamp: new Date(Date.now() - 1000 * 60 * 14)
    },
    {
      id: '3',
      type: 'user',
      content: 'Yes, that sounds perfect. Can you also include support for YouTube video analysis?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10)
    },
    {
      id: '4',
      type: 'ai',
      content: 'Great idea! I\'ll include YouTube video analysis capabilities. This will allow users to:\n\n• Paste YouTube links for automatic processing\n• Get video summaries and key insights\n• Analyze video content and extract information\n• Support for timestamps and chapter navigation\n\nThe interface will have separate input tabs for regular queries and YouTube links.',
      timestamp: new Date(Date.now() - 1000 * 60 * 8)
    }
  ]);

  const handleSendMessage = async (content: string, type: 'query' | 'youtube') => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'query') {
        setQueryInput("");
      } else {
        setYoutubeInput("");
      }
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex h-screen bg-chat-background">
      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-chat-sidebar border-r border-chat-border flex flex-col overflow-hidden`}>
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-chat-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">ChatGPT</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full mb-3 bg-primary hover:bg-primary/90"
                onClick={() => {}}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-chat-input border-chat-border"
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 py-2">
                {chats
                  .filter(chat => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        chat.isActive 
                          ? 'bg-chat-hover text-foreground' 
                          : 'text-muted-foreground hover:bg-chat-hover hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(chat.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            {/* User Account */}
            <div className="p-4 border-t border-chat-border">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 border-b border-chat-border bg-chat-background">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            <h1 className="font-semibold text-foreground">Product Roadmap Discussion</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-chat-ai-bubble rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-chat-ai-text" />
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-chat-user-bubble text-chat-user-text'
                        : 'bg-chat-ai-bubble text-chat-ai-text'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 px-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.type === 'ai' && (
                      <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground">
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-chat-user-bubble rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-chat-user-text" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-chat-ai-bubble rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-chat-ai-text" />
                </div>
                <div className="bg-chat-ai-bubble rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="border-t border-chat-border bg-chat-background p-4">
          <div className="max-w-4xl mx-auto">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="query">Query</TabsTrigger>
                <TabsTrigger value="youtube">YouTube</TabsTrigger>
              </TabsList>
              
              <TabsContent value="query" className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Type your message here..."
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      className="min-h-[60px] pr-24 bg-chat-input border-chat-border resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(queryInput, 'query');
                        }
                      }}
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        className="w-8 h-8"
                        onClick={() => handleSendMessage(queryInput, 'query')}
                        disabled={!queryInput.trim() || isLoading}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="youtube" className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste YouTube video URL here..."
                      value={youtubeInput}
                      onChange={(e) => setYoutubeInput(e.target.value)}
                      className="bg-chat-input border-chat-border"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSendMessage(youtubeInput, 'youtube');
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={() => handleSendMessage(youtubeInput, 'youtube')}
                    disabled={!youtubeInput.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Summarize
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
