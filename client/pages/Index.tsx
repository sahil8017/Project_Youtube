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
  const [inputRows, setInputRows] = useState(1);
  const [isNewChat, setIsNewChat] = useState(true);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

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
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          if (currentTab === "youtube") {
            setYoutubeInput(prev => {
              const newValue = prev ? `${prev} ${transcript}` : transcript;
              // Trigger auto-expansion
              setTimeout(() => {
                if (inputRef.current) {
                  handleInputChange(newValue);
                }
              }, 10);
              return newValue;
            });
          } else {
            setQueryInput(prev => {
              const newValue = prev ? `${prev} ${transcript}` : transcript;
              // Trigger auto-expansion
              setTimeout(() => {
                if (inputRef.current) {
                  handleInputChange(newValue);
                }
              }, 10);
              return newValue;
            });
          }
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input field shortcuts
      if (e.target === inputRef.current) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "m":
          case "M":
            e.preventDefault();
            handleSpeechRecognition();
            break;
          case "u":
          case "U":
            e.preventDefault();
            // Focus will trigger file upload dialog if implemented
            break;
          case "/":
            e.preventDefault();
            if (inputRef.current) {
              inputRef.current.focus();
            }
            break;
          case "a":
          case "A":
            // Don't prevent Ctrl+A in input field
            if (document.activeElement !== inputRef.current) {
              e.preventDefault();
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      type: "user",
      content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "msg-2",
      type: "ai",
      content:
        'I\'ve analyzed the YouTube video. This is "Never Gonna Give You Up" by Rick Astley, the famous 1987 hit that became an internet meme known as "Rickrolling."\n\nKey details:\n• Duration: 3:33\n• Views: 1.4B+\n• Released: 1987\n• Genre: Pop\n\nThe video features classic 80s production style and Rick Astley\'s distinctive dance moves. It became a cultural phenomenon when internet users began using it for pranks in the 2000s.',
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
    {
      id: "msg-3",
      type: "user",
      content: "Can you tell me more about why it became a meme?",
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: "msg-4",
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
    if (!content.trim() || isLoading) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, newMessage]);

    // Clear input immediately
    if (type === "query") {
      setQueryInput("");
    } else {
      setYoutubeInput("");
    }

    // DON'T reset input height - preserve expansion like ChatGPT
    // setInputRows(1);
    setIsNewChat(false);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const aiResponse: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "ai",
        content: `This is a simulated response to: "${content}". In a real implementation, this would be the actual AI response from your YouTube summarizer API.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // Refocus input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }, 2000);
  };

  const handleInputChange = (value: string) => {
    if (currentTab === "youtube") {
      setYoutubeInput(value);
    } else {
      setQueryInput(value);
    }

    // Auto-expand like ChatGPT - preserve height and expand smoothly
    if (inputRef.current) {
      // Reset height to auto to calculate new height
      inputRef.current.style.height = 'auto';
      const scrollHeight = inputRef.current.scrollHeight;
      const lineHeight = 24; // 1.5rem in pixels
      const minHeight = 52; // Minimum height (slightly larger for better UX)
      const maxHeight = 200; // Maximum height before scrolling

      if (scrollHeight <= maxHeight) {
        inputRef.current.style.height = Math.max(scrollHeight, minHeight) + 'px';
        inputRef.current.style.overflowY = 'hidden';
      } else {
        inputRef.current.style.height = maxHeight + 'px';
        inputRef.current.style.overflowY = 'auto';
      }

      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), 1), 8);
      setInputRows(newRows);
    }
  };

  // Preserve text and caret position during tab switch
  const handleTabSwitch = () => {
    const currentInput = inputRef.current;
    const caretPosition = currentInput?.selectionStart || 0;
    const currentValue = currentTab === "youtube" ? youtubeInput : queryInput;

    setCurrentTab(currentTab === "youtube" ? "query" : "youtube");

    // Preserve the text and caret position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(caretPosition, caretPosition);
        // Trigger auto-expansion for the preserved text
        handleInputChange(currentValue);
      }
    }, 10);
  };

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

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
        } transition-all duration-300 ease-in-out bg-accent/30 border-r border-border flex flex-col overflow-hidden`}
      >
        {sidebarOpen && (
          <>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  YouTube Summarizer
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 rounded-lg h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Button
                className="w-full mb-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2.5 font-medium transition-all duration-200 hover:shadow-md"
                onClick={() => {}}
              >
                <Plus className="w-4 h-4 mr-2" />
                New chat
              </Button>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1 px-3 mt-4 custom-scrollbar">
              <div className="space-y-2">
                {chats
                  .filter((chat) =>
                    chat.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                  )
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`group px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        chat.isActive
                          ? "bg-accent text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary/60 transition-colors"></div>
                        <p className="text-sm truncate font-medium">{chat.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatTime(chat.timestamp)}
                      </p>
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
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 rounded-lg h-8 w-8"
              >
                <Menu className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-lg font-semibold text-foreground">
              {chats.find((chat) => chat.isActive)?.title || "New Chat"}
            </h1>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={chatContainerRef}
            className="h-full px-4 py-6 overflow-y-auto custom-scrollbar"
            style={{ height: 'calc(100vh - 140px)' }}
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex w-full ${message.type === "user" ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-4 duration-500`}
                  style={{
                    animationDelay: `${Math.min(index * 100, 500)}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className={`flex gap-4 max-w-[80%] sm:max-w-[75%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-primary/20">
                      {message.type === "ai" ? (
                        <Bot className="w-4 h-4 text-primary" />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div
                        className={`rounded-2xl px-4 py-3 transition-all duration-200 hover:shadow-lg ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-accent/50 text-accent-foreground border border-border/50 shadow-sm"
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className={`flex mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex w-full justify-start group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-4 max-w-[80%] sm:max-w-[75%]">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-accent/50 rounded-2xl px-4 py-3 border border-border/50 shadow-sm">
                      <div className="flex gap-1.5">
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
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="border-t border-border bg-background/95 backdrop-blur-sm sticky bottom-0">
          <div className="max-w-3xl mx-auto p-4">
            {/* Switch Mode Button */}
            <div className="flex items-center justify-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTabSwitch}
                className="text-xs text-muted-foreground hover:text-foreground transition-all duration-200 px-4 py-2 rounded-full border border-border/30 hover:border-border/60 hover:bg-accent/30 backdrop-blur-sm"
              >
                {currentTab === "youtube"
                  ? "💬 Switch to Questions"
                  : "🎬 Switch to YouTube URL"}
              </Button>
            </div>

            {/* Input Area */}
            <div className="relative bg-background border border-border rounded-xl shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/10">
              <Textarea
                ref={inputRef}
                placeholder={
                  currentTab === "youtube"
                    ? "Enter YouTube URL..."
                    : "Ask a question..."
                }
                value={currentTab === "youtube" ? youtubeInput : queryInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full bg-transparent border-0 resize-none pr-20 pl-4 py-3 text-sm leading-relaxed transition-all duration-150 ease-in-out focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 custom-scrollbar"
                style={{
                  minHeight: "52px",
                  height: "auto",
                  maxHeight: "200px",
                  lineHeight: "1.5",
                }}
                rows={1}
                onKeyDown={(e) => {
                  // Handle Ctrl+A to select all text in textarea (ChatGPT behavior)
                  if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (inputRef.current) {
                      inputRef.current.select();
                    }
                    return;
                  }

                  // Enter to send, Shift+Enter for new line
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (currentTab === "youtube") {
                      handleSendMessage(youtubeInput, "youtube");
                    } else {
                      handleSendMessage(queryInput, "query");
                    }
                  } else if (e.key === "Enter" && e.shiftKey) {
                    // Allow Shift+Enter to create new lines
                    // Default behavior will handle this
                  } else if (e.key === "Escape") {
                    // Unfocus textarea on Escape (ChatGPT behavior)
                    e.preventDefault();
                    if (inputRef.current) {
                      inputRef.current.blur();
                    }
                  }
                }}
                aria-label={
                  currentTab === "youtube"
                    ? "Enter YouTube URL"
                    : "Ask a question"
                }
                role="textbox"
                aria-multiline="true"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                <FileUploadDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-muted-foreground hover:bg-accent rounded-lg transition-all duration-200"
                    title="Upload files (Ctrl+U)"
                    aria-label="Upload files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </FileUploadDialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-8 h-8 rounded-lg transition-all duration-200 ${isListening ? "text-red-500 bg-red-50 dark:bg-red-950" : "text-muted-foreground hover:bg-accent"}`}
                  onClick={handleSpeechRecognition}
                  title={
                    isListening
                      ? "Stop voice input (Ctrl+M)"
                      : "Start voice input (Ctrl+M)"
                  }
                  aria-label={
                    isListening ? "Stop voice input" : "Start voice input"
                  }
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className="w-8 h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                  title="Send message (Enter)"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground/50 leading-relaxed">
                YouTube Summarizer can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
