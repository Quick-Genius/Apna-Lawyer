import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { chatService, ChatMessage as ChatMessageType, ChatSession } from "../services/chatService";
import { 
  Send, 
  Mic, 
  Upload, 
  MessageCircle, 
  FileText,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Folder,
  Users as UsersIcon,
  Loader2,
  X
} from "lucide-react";

interface AIChatPageProps {
  selectedAvatar?: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai' | 'system';
  message: string;
  timestamp: string;
  confidence?: number;
}

export default function AIChatPage({ selectedAvatar = "mike" }: AIChatPageProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarInfo = {
    mike: { name: "Mike", title: "Legal Expert", avatar: "/avatars/male-avatar.png" },
    anne: { name: "Anne", title: "Legal Advisor", avatar: "/avatars/female-avatar.png" }
  };

  const currentAvatar = avatarInfo[selectedAvatar as keyof typeof avatarInfo] || avatarInfo.mike;

  const sampleQuestions = [
    "What does this non-compete clause mean?",
    "Is this contract fair to both parties?",
    "What are the key risks in this agreement?",
    "Can you explain the termination clause?",
    "What should I negotiate in this contract?"
  ];

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChatSession();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChatSession = async () => {
    try {
      setIsLoading(true);
      const session = await chatService.createSession();
      setCurrentSession(session);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now(),
        type: 'system',
        message: `Hello! I'm ${currentAvatar.name}, your ${currentAvatar.title}. I'm here to help you understand legal documents, contracts, and answer your legal questions. You can upload a document or ask me anything!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now(),
        type: 'system',
        message: 'Sorry, I encountered an issue starting our conversation. Please try refreshing the page.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !currentSession || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      // If there's a file, upload it first
      if (selectedFile) {
        setUploadingFile(true);
        await chatService.uploadDocumentToSession(currentSession.id, selectedFile);
        setSelectedFile(null); // Clear the file after upload
      }

      // Send the message
      const aiResponse = await chatService.sendMessage(currentSession.id, userMessage.message);
      
      const aiMessage: ChatMessage = {
        id: aiResponse.id,
        type: 'ai',
        message: aiResponse.message,
        timestamp: new Date(aiResponse.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: aiResponse.confidence
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now(),
        type: 'system',
        message: 'Sorry, I encountered an issue processing your message. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setUploadingFile(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file only.');
      return;
    }

    setSelectedFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col">
      <div className="flex flex-1">
        {/* Avatar Sidebar */}
        <div className="w-80 bg-gradient-to-b from-[#F9FAFB] to-[#F9FAFB]/95 border-r border-gray-100 p-6 flex flex-col relative">
          {/* Subtle gold accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
        {/* Avatar Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg ring-2 ring-[#D4AF37]/20 bg-gradient-to-br from-[#AEC6CF] to-[#77DDE7] flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl text-[#36454F] mb-1">{currentAvatar.name}</h3>
          <p className="text-[#AEC6CF] text-sm mb-3">{currentAvatar.title}</p>
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mx-auto mb-2 shadow-sm ring-1 ring-green-400/20"></div>
          <p className="text-xs text-gray-500">
            {isLoading ? "Connecting..." : "Online • Ready to help"}
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h4 className="text-[#36454F] mb-4">Quick Access</h4>
          <div className="space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-auto p-3 hover:bg-white/80 text-gray-600 hover:text-[#36454F] rounded-xl"
            >
              <Folder className="w-4 h-4 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm">My Documents</div>
                <div className="text-xs text-gray-500">View uploaded files</div>
              </div>
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-auto p-3 hover:bg-white/80 text-gray-600 hover:text-[#36454F] rounded-xl"
            >
              <UsersIcon className="w-4 h-4 mr-3 flex-shrink-0" />
              <div>
                <div className="text-sm">Find a Lawyer</div>
                <div className="text-xs text-gray-500">Connect with experts</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Sample Questions */}
        <div>
          <h4 className="text-[#36454F] mb-4">Sample Questions</h4>
          <div className="space-y-2">
            {sampleQuestions.slice(0, 3).map((question, index) => (
              <Button 
                key={index}
                variant="ghost" 
                size="sm"
                className="w-full text-left justify-start text-gray-600 hover:text-[#36454F] hover:bg-white/80 h-auto p-3 text-xs rounded-xl"
                onClick={() => setMessage(question)}
                disabled={isSending || isLoading}
              >
                "{question}"
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading && chatHistory.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#AEC6CF]" />
                <span className="ml-2 text-gray-500">Starting conversation...</span>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <div key={chat.id} className={`flex gap-4 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className={`${
                      chat.type === 'user' 
                        ? 'bg-[#AEC6CF]/20 border border-[#AEC6CF]/50' 
                        : chat.type === 'system'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-white border border-gray-200'
                    } text-[#36454F]`}>
                      {chat.type === 'user' ? (
                        <User className="w-5 h-5" />
                      ) : chat.type === 'system' ? (
                        <Sparkles className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[75%] ${chat.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`p-4 rounded-2xl ${
                      chat.type === 'user' 
                        ? 'bg-[#AEC6CF] text-[#36454F]' 
                        : chat.type === 'system'
                        ? 'bg-yellow-50 border border-yellow-200 text-[#36454F]'
                        : 'bg-white border border-gray-100 text-[#36454F] shadow-sm'
                    }`}>
                      <p className="whitespace-pre-line">{chat.message}</p>
                      {chat.type === 'ai' && chat.confidence && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                            {Math.round(chat.confidence)}% confidence
                          </Badge>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-green-500">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-red-500">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                              onClick={() => navigator.clipboard.writeText(chat.message)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 px-1">{formatTimestamp(chat.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
            {isSending && (
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-white border border-gray-200 text-[#36454F]">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="max-w-[75%]">
                  <div className="p-4 rounded-2xl bg-white border border-gray-100 text-[#36454F] shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sticky Input Bar */}
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-6 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 mb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
              />
              {/* File Preview - appears above the upload button when a file is selected */}
              {selectedFile && (
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">PDF</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                    onClick={handleRemoveFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              {/* Upload Button - always visible */}
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl w-fit"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile || isLoading}
              >
                {uploadingFile ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-1" />
                )}
                {uploadingFile ? "Uploading..." : "Upload PDF"}
              </Button>
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your legal question or upload a document for analysis..."
                className="flex-1 bg-white border-gray-200 text-[#36454F] placeholder-gray-500 resize-none rounded-2xl shadow-sm"
                rows={2}
                disabled={isSending || isLoading}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isListening ? 'bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] border-[#77DDE7]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} rounded-xl h-10 w-10 p-0`}
                  onClick={() => setIsListening(!isListening)}
                  disabled={isSending || isLoading}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] shadow-sm rounded-xl h-10 w-10 p-0"
                  disabled={!message.trim() || isSending || isLoading}
                  onClick={handleSendMessage}
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Footer */}

    </div>
  );
}