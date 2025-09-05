import React, { useState, useEffect } from "react";
import ApiService from "../services/api";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Footer from "./Footer";
// import exampleImage from 'figma:asset/50e4234ba32f3a17fa4abf21568d7e5aef2fe1a0.png';
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
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Folder,
  Users as UsersIcon
} from "lucide-react";

interface AIChatPageProps {
  selectedAvatar?: string;
}

export default function AIChatPage({ selectedAvatar = "Mike" }: AIChatPageProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const apiService = ApiService;

  const avatarInfo = {
    Mike: { name: "Mike", title: "Legal Expert" },
    Anne: { name: "Anne", title: "Legal Advisor" }
  };

  const currentAvatar = avatarInfo[selectedAvatar as keyof typeof avatarInfo] || avatarInfo.Mike;

  const sampleQuestions = [
    "What does this non-compete clause mean?",
    "Is this contract fair to both parties?",
    "What are the key risks in this agreement?",
    "Can you explain the termination clause?",
    "What should I negotiate in this contract?"
  ];

  // Initialize chat session and check authentication
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          // For demo purposes, create a guest user
          await registerGuestUser();
        } else {
          setIsAuthenticated(true);
          await createChatSession();
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initializeChat();
  }, []);

  const registerGuestUser = async () => {
    try {
      const guestData = {
        username: `guest_${Date.now()}`,
        email: `guest_${Date.now()}@example.com`,
        first_name: 'Guest',
        last_name: 'User',
        password: 'guestpass123',
        password_confirm: 'guestpass123'
      };
      
      const response = await apiService.register(guestData);
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setIsAuthenticated(true);
        await createChatSession();
      }
    } catch (error) {
      console.error('Failed to register guest user:', error);
    }
  };

  const createChatSession = async () => {
    try {
      const session = await apiService.createChatSession();
      setCurrentSessionId(session.data?.id);
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentSessionId || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const currentMessage = message;
    setMessage('');

    try {
      const response = await apiService.sendMessage(currentSessionId, currentMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response.data?.ai_response?.content || 'No response received',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: response.data?.ai_response?.confidence || 95
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) {
      console.error('No active chat session');
      return;
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        message: 'Sorry, only PDF files are supported for upload.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.split('.')[0]); // Use filename without extension as title
      
      const response = await apiService.uploadDocumentToChat(currentSessionId, formData);
      
      if (response.data) {
        // Add a message showing the document was uploaded
        const uploadMessage = {
          id: Date.now(),
          type: 'system',
          message: `📄 Document "${file.name}" uploaded and analyzed successfully! You can now ask questions about this document.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: 100
        };
        
        setMessages(prev => [...prev, uploadMessage]);

        // Add analysis summary if available
        if (response.data.analysis_summary) {
          const summaryMessage = {
            id: Date.now() + 1,
            type: 'ai',
            message: `Here's a quick summary of your document:\n\n${response.data.analysis_summary}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            confidence: 95
          };
          setMessages(prev => [...prev, summaryMessage]);
        }
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Sorry, I failed to upload and analyze the document. ${error instanceof Error ? error.message : 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const quickActions = [
    { icon: Upload, label: "Upload Document", description: "Analyze a new legal document" },
    { icon: FileText, label: "Document Summary", description: "Get a quick overview of key terms" },
    { icon: MessageCircle, label: "Risk Assessment", description: "Identify potential legal risks" },
    { icon: Sparkles, label: "Clause Explanation", description: "Understand specific clauses" }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col">
      <div className="flex flex-1">
        {/* Avatar Sidebar */}
        <div className="w-80 bg-[#F9FAFB] border-r border-gray-100 p-6 flex flex-col">
        {/* Avatar Section */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {currentAvatar.name[0]}
            </div>
          </div>
          <h3 className="text-xl text-[#36454F] mb-1">{currentAvatar.name}</h3>
          <p className="text-[#AEC6CF] text-sm mb-3">{currentAvatar.title}</p>
          <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Online • Ready to help</p>
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
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Welcome to Legal AI Assistant</h3>
                <p className="text-sm">Ask me any legal question or try one of the sample questions below.</p>
              </div>
            )}
            {messages.map((chat) => (
              <div key={chat.id} className={`flex gap-4 ${chat.type === 'user' ? 'flex-row-reverse' : chat.type === 'system' ? 'justify-center' : ''}`}>
                {chat.type !== 'system' && (
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className={`${chat.type === 'user' ? 'bg-[#AEC6CF]/20 border border-[#AEC6CF]/50' : 'bg-white border border-gray-200'} text-[#36454F]`}>
                      {chat.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`${chat.type === 'system' ? 'max-w-[90%]' : 'max-w-[75%]'} ${chat.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    chat.type === 'user' 
                      ? 'bg-[#AEC6CF] text-[#36454F]' 
                      : chat.type === 'system'
                      ? 'bg-blue-50 border border-blue-200 text-blue-800 text-center'
                      : 'bg-white border border-gray-100 text-[#36454F] shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{chat.message}</p>
                    {chat.type === 'ai' && chat.confidence && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {chat.confidence}% confidence
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-green-500">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-red-500">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {chat.type !== 'system' && (
                    <p className="text-xs text-gray-500 mt-2 px-1">{chat.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Input Bar */}
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl" asChild>
                  <span>
                    <Paperclip className="w-4 h-4 mr-1" />
                    {isUploading ? 'Uploading...' : 'Attach Image'}
                  </span>
                </Button>
              </label>
              
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleDocumentUpload}
                style={{ display: 'none' }}
                id="document-upload"
              />
              <label htmlFor="document-upload">
                <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-1" />
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </span>
                </Button>
              </label>
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your legal question or upload a document for analysis..."
                className="flex-1 bg-white border-gray-200 text-[#36454F] placeholder-gray-500 resize-none rounded-2xl shadow-sm"
                rows={2}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isListening ? 'bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] border-[#77DDE7]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} rounded-xl h-10 w-10 p-0`}
                  onClick={() => setIsListening(!isListening)}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] shadow-sm rounded-xl h-10 w-10 p-0"
                  disabled={!message.trim() || isLoading}
                  onClick={sendMessage}
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#36454F] border-t-transparent rounded-full animate-spin" />
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

    </div>
  );
}