import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { FileUploadDialog, YouTubeThumbnail } from "@/components/chat-features";
import { VideoCard, VideoSummary } from "@/components/youtube-video";
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
  Play,
  Clock,
  Eye,
  Download,
  Bookmark,
  ExternalLink,
  Mic,
  MicOff,
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
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    const checkIsMobile = () => {
      const wasMobile = isMobile;
      const nowMobile = window.innerWidth < 768;
      setIsMobile(nowMobile);

      // Only auto-close sidebar when switching from desktop to mobile
      // Don't auto-open when switching from mobile to desktop
      if (!wasMobile && nowMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    // Initialize speech recognition
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (currentTab === "youtube") {
          setYoutubeInput((prev) => prev + (prev ? " " : "") + transcript);
        } else {
          setQueryInput((prev) => prev + (prev ? " " : "") + transcript);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [currentTab]);

  // Mock data
  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "10 Minute React Tutorial",
      lastMessage:
        "This video covers React basics including components, props, and state management...",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isActive: true,
    },
    {
      id: "2",
      title: "Node.js Crash Course 2024",
      lastMessage:
        "Key points: Express setup, middleware, routing, and database integration...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: "3",
      title: "AI and Machine Learning Explained",
      lastMessage:
        "The video explains neural networks, training processes, and practical applications...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: "4",
      title: "TypeScript for Beginners",
      lastMessage:
        "Covers type annotations, interfaces, generics, and TypeScript configuration...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: "5",
      title: "CSS Grid vs Flexbox",
      lastMessage:
        "Comparison of layout methods, when to use each, and practical examples...",
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
        'I\'ve analyzed the YouTube video. This is "Never Gonna Give You Up" by Rick Astley, the famous 1987 hit that became an internet meme known as "Rickrolling."\n\nKey details:\n• Duration: 3:33\n• Views: 1.4B+\n• Released: 1987\n• Genre: Pop\n\nThe video features classic 80s production style and Rick Astley\'s distinctive dance moves. It became a cultural phenomenon when internet users began using it for pranks in the 2000s.',
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
    {
      id: "3",
      type: "user",
      content: "Can you tell me more about why it became a meme?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: "4",
      type: "ai",
      content:
        "The \"Rickrolling\" meme started around 2007. People would share links claiming to be something else, but they actually led to this music video. It became popular because:\n\n• The song is unexpectedly catchy and wholesome\n• Rick Astley's earnest performance contrasts with prank context\n• The video quality and 80s aesthetic became nostalgic\n• Rick Astley himself embraced the meme good-naturedly\n\nIt's one of the most enduring internet memes and helped introduce the song to new generations.",
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

  const handleSpeechRecognition = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  YouTube Summarizer
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground hover:bg-accent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button
                className="w-full mb-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                onClick={() => {}}
              >
                <Plus className="w-4 h-4 mr-2" />
                New chat
              </Button>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-1">
                {chats
                  .filter((chat) =>
                    chat.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        chat.isActive
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <p className="text-sm truncate">{chat.title}</p>
                    </div>
                  ))}
              </div>
            </ScrollArea>

            {/* User Account */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">User</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Controls */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground hover:bg-accent"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-lg font-medium text-foreground">
              {chats.find((chat) => chat.isActive)?.title || "New Chat"}
            </h1>
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
                    className={`rounded-lg px-4 py-3 max-w-none ${
                      message.type === "user"
                        ? "bg-chat-user-bubble text-chat-user-text"
                        : "bg-chat-ai-bubble text-chat-ai-text"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 px-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
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
        <div className="border-t border-border bg-background p-4 transition-all duration-200 ease-in-out">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                key={currentTab}
                placeholder={
                  currentTab === "youtube"
                    ? "Enter YouTube URL..."
                    : "Ask a question..."
                }
                value={currentTab === "youtube" ? youtubeInput : queryInput}
                onChange={(e) => {
                  if (currentTab === "youtube") {
                    setYoutubeInput(e.target.value);
                  } else {
                    setQueryInput(e.target.value);
                  }
                }}
                className="w-full bg-input border-border rounded-xl resize-none pr-16 min-h-[50px] transition-all duration-200 ease-in-out"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (currentTab === "youtube") {
                      handleSendMessage(youtubeInput, "youtube");
                    } else {
                      handleSendMessage(queryInput, "query");
                    }
                  }
                }}
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <FileUploadDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-muted-foreground hover:bg-accent"
                    title="Upload files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </FileUploadDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 ${isListening ? "text-red-500 bg-red-50" : "text-muted-foreground hover:bg-accent"}`}
                  onClick={handleSpeechRecognition}
                  title="Voice input"
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className="w-8 h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    if (currentTab === "youtube") {
                      handleSendMessage(youtubeInput, "youtube");
                    } else {
                      handleSendMessage(queryInput, "query");
                    }
                  }}
                  disabled={
                    (currentTab === "youtube"
                      ? !youtubeInput.trim()
                      : !queryInput.trim()) || isLoading
                  }
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentTab(currentTab === "youtube" ? "query" : "youtube")
                }
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {currentTab === "youtube"
                  ? "💬 Switch to Questions"
                  : "🎬 Switch to YouTube URL"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
