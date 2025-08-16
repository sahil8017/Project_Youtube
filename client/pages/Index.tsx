import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUploadDialog, YouTubeThumbnail } from "@/components/chat-features";
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
  Plus,
  Settings,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  attachments?: {
    type: "image" | "file" | "youtube";
    url: string;
    name?: string;
  }[];
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive?: boolean;
}

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("youtube");
  const [queryInput, setQueryInput] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "10 Minute React Tutorial",
      lastMessage: "This video covers React basics including components, props, and state management...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isActive: true,
    },
    {
      id: "2",
      title: "Node.js Crash Course 2024",
      lastMessage: "Key points: Express setup, middleware, routing, and database integration...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "3",
      title: "AI and Machine Learning Explained",
      lastMessage: "The video explains neural networks, training processes, and practical applications...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "4",
      title: "TypeScript for Beginners",
      lastMessage: "Covers type annotations, interfaces, generics, and TypeScript configuration...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: "5",
      title: "CSS Grid vs Flexbox",
      lastMessage: "Comparison of layout methods, when to use each, and practical examples...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "2",
      type: "ai",
      content:
        '🎵 **"Never Gonna Give You Up" by Rick Astley**\n\n**Video Summary:**\nThis iconic 1987 music video features Rick Astley performing his hit song "Never Gonna Give You Up." The video has become a cultural phenomenon, particularly known for "Rickrolling."\n\n**Key Points:**\n• Duration: 3:33\n• Views: 1.4B+ views\n• Classic 80s production style\n• Features Rick Astley\'s distinctive dance moves\n• Became an internet meme in the 2000s\n\n**Main Themes:**\n- Commitment and loyalty in relationships\n- 80s pop culture and music\n- Internet culture and memes',
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
    {
      id: "3",
      type: "user",
      content: "Can you provide more details about the cultural impact?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: "4",
      type: "ai",
      content:
        "**Cultural Impact of 'Never Gonna Give You Up':**\n\n🌐 **Internet Phenomenon:**\n• 'Rickrolling' became one of the most famous internet memes\n• Started around 2007 when users would trick others into clicking the video\n• The song experienced a massive resurgence decades after its release\n\n📈 **Numbers & Recognition:**\n• Over 1.4 billion YouTube views\n• Reached #1 in 25 countries when originally released\n• Rick Astley embraced the meme culture\n• Featured in countless remixes and parodies\n\n🎭 **Legacy:**\n• Transformed from 80s hit to modern internet culture staple\n• Demonstrates how digital platforms can revive classic content\n• Rick Astley became an unexpected internet celebrity\n• The song is now synonymous with pranks and surprises online",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    },
  ]);

  const handleSendMessage = async (
    content: string,
    type: "query" | "youtube",
  ) => {
    if (!content.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (type === "query") {
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

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex h-screen bg-chat-background relative">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-0"} ${
          isMobile ? "fixed left-0 top-0 h-full z-20" : "relative"
        } transition-all duration-300 bg-chat-sidebar border-r border-chat-border flex flex-col overflow-hidden`}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-chat-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-foreground">YT Summarizer</span>
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
                className="w-full mb-3 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {}}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Summary
              </Button>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search summaries..."
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
                  .filter((chat) =>
                    chat.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        chat.isActive
                          ? "bg-chat-hover text-foreground"
                          : "text-muted-foreground hover:bg-chat-hover hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(chat.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            {/* User Account */}
            <div className="p-4 border-t border-chat-border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <ThemeToggle />
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
            <h1 className="font-semibold text-foreground">
              Product Roadmap Discussion
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Archive className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <div className="w-8 h-8 bg-chat-ai-bubble rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-chat-ai-text" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] ${message.type === "user" ? "order-first" : ""}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.type === "user"
                        ? "bg-chat-user-bubble text-chat-user-text"
                        : "bg-chat-ai-bubble text-chat-ai-text"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 px-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.type === "ai" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 text-muted-foreground"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {message.type === "user" && (
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
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Section */}
        <div className="border-t border-chat-border bg-chat-background p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4">
                <TabsTrigger value="youtube" className="text-sm">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube URL
                </TabsTrigger>
                <TabsTrigger value="query" className="text-sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask Question
                </TabsTrigger>
              </TabsList>

              <TabsContent value="query" className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Textarea
                      placeholder="Ask a follow-up question about the video..."
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      className="min-h-[60px] pr-20 sm:pr-24 bg-chat-input border-chat-border resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(queryInput, "query");
                        }
                      }}
                    />
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex gap-1 sm:gap-2">
                      <FileUploadDialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground"
                        >
                          <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </FileUploadDialog>
                      <Button
                        size="icon"
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        onClick={() => handleSendMessage(queryInput, "query")}
                        disabled={!queryInput.trim() || isLoading}
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste YouTube video URL here..."
                      value={youtubeInput}
                      onChange={(e) => setYoutubeInput(e.target.value)}
                      className="bg-chat-input border-chat-border"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSendMessage(youtubeInput, "youtube");
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => handleSendMessage(youtubeInput, "youtube")}
                    disabled={!youtubeInput.trim() || isLoading}
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
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
