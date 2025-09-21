import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { apiService, ChatMessage } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { 
  Send, 
  Mic, 
  Upload, 
  MessageCircle, 
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Folder,
  Users as UsersIcon,
  Loader2,
  Image as ImageIcon,
  AlertCircle,

  FileText
} from "lucide-react";

interface AIChatPageProps {
  selectedAvatar?: string;
}

export default function AIChatPage({ selectedAvatar = "mike" }: AIChatPageProps) {
  const { isSignedIn, user } = useAuth();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string>("");
  const [attachedDocument, setAttachedDocument] = useState<File | null>(null);
  const [attachedDocumentName, setAttachedDocumentName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const avatarInfo = {
    mike: { name: "Mike", title: "Legal Expert", avatar: "/avatars/male-avatar.png" },
    anne: { name: "Anne", title: "Legal Advisor", avatar: "/avatars/female-avatar.png" }
  };

  const currentAvatar = avatarInfo[selectedAvatar as keyof typeof avatarInfo] || avatarInfo.mike;

  // Load chat history when authentication status changes
  useEffect(() => {
    if (isSignedIn) {
      loadChatHistory();
    } else {
      // Clear chat history when user signs out
      setChatHistory([]);
    }
  }, [isSignedIn]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    // Only load chat history if user is signed in
    if (!isSignedIn) {
      console.log('User not signed in, skipping chat history load');
      return;
    }

    try {
      const response = await apiService.getChatHistory();
      const formattedHistory: ChatMessage[] = [];
      
      response.chats.forEach((chat) => {
        // Add user message
        formattedHistory.push({
          id: `user-${chat.id}`,
          type: 'user',
          message: chat.user_message,
          timestamp: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Add AI response
        formattedHistory.push({
          id: `ai-${chat.id}`,
          type: 'ai',
          message: chat.ai_response,
          timestamp: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidence: Math.floor(Math.random() * 10) + 90 // Mock confidence for now
        });
      });
      
      setChatHistory(formattedHistory.reverse()); // Reverse to show oldest first
      
      // Only show error if there was existing chat history that failed to load
      // If response.chats is empty, that's normal (no chat history yet)
      
    } catch (err) {
      console.error('Failed to load chat history:', err);
      
      // Only show error message if:
      // 1. User is signed in (we already checked this)
      // 2. It's not a 403/401 error (authentication issue)
      // 3. It's not a "no chat history" scenario (empty response is normal)
      if (err instanceof Error) {
        const errorMessage = err.message.toLowerCase();
        const isAuthError = errorMessage.includes('sign in') || 
                           errorMessage.includes('unauthorized') || 
                           errorMessage.includes('forbidden');
        const isNoDataError = errorMessage.includes('no chat') || 
                             errorMessage.includes('not found');
        
        // Only show error for actual failures, not for empty/missing data
        if (!isAuthError && !isNoDataError) {
          setError('Failed to load chat history. Please try refreshing the page.');
        }
      }
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !attachedImage && !attachedDocument) || isLoading) return;

    const userMessage = message.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create user message display text
    let displayMessage = userMessage;
    if (attachedImage && attachedImageName) {
      displayMessage = userMessage ? `${userMessage}\n\n📷 ${attachedImageName}` : `📷 ${attachedImageName}`;
    } else if (attachedDocument && attachedDocumentName) {
      displayMessage = userMessage ? `${userMessage}\n\n📄 ${attachedDocumentName}` : `📄 ${attachedDocumentName}`;
    }
    
    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: displayMessage,
      timestamp
    };
    
    setChatHistory(prev => [...prev, userChatMessage]);
    
    // Clear inputs
    setMessage("");
    const currentAttachedImage = attachedImage;
    const currentAttachedDocument = attachedDocument;
    setAttachedImage(null);
    setAttachedImageName("");
    setAttachedDocument(null);
    setAttachedDocumentName("");
    setIsLoading(true);
    setError(null);

    try {
      let response;
      
      if (currentAttachedImage) {
        // Send message with image (OCR happens on backend)
        response = await apiService.sendMessage(
          userMessage || "Please analyze this image", 
          currentAttachedImage
        );
      } else if (currentAttachedDocument) {
        // Extract text from document first, then send message
        const docResponse = await apiService.extractTextFromDocument(currentAttachedDocument);
        if (docResponse.success && docResponse.extracted_text) {
          const documentText = `Document content:\n\n${docResponse.extracted_text}`;
          const finalMessage = userMessage ? `${userMessage}\n\n${documentText}` : `Please analyze this document:\n\n${documentText}`;
          response = await apiService.sendMessage(finalMessage);
        } else {
          throw new Error('Failed to extract text from document');
        }
      } else {
        // Regular text message
        response = await apiService.sendMessage(userMessage);
      }
      
      // Add AI response to chat
      const aiChatMessage: ChatMessage = {
        id: response.chat_id ? `ai-${response.chat_id}` : `ai-${Date.now()}`,
        type: 'ai',
        message: response.response,
        timestamp: response.timestamp ? new Date(response.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : timestamp,
        confidence: Math.floor(Math.random() * 10) + 90 // Mock confidence for now
      };
      
      setChatHistory(prev => [...prev, aiChatMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError(null);

    try {
      // Convert image to base64 for attachment (NO OCR yet)
      const base64 = await apiService.fileToBase64(file);
      setAttachedImage(base64);
      setAttachedImageName(file.name);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a supported document type
    const supportedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!supportedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    setError(null);

    try {
      // Attach document for processing on send (like images)
      setAttachedDocument(file);
      setAttachedDocumentName(file.name);
      
      // Reset file input
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Failed to process document:', err);
      setError(err instanceof Error ? err.message : 'Failed to process document');
    }
  };



  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sampleQuestions = [
    "What does this non-compete clause mean?",
    "Is this contract fair to both parties?",
    "What are the key risks in this agreement?",
    "Can you explain the termination clause?",
    "What should I negotiate in this contract?"
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col">
      <div className="flex flex-1">
        {/* Avatar Sidebar */}
        <div className="w-80 bg-gradient-to-b from-[#F9FAFB] to-[#F9FAFB]/95 border-r border-gray-100 p-6 flex flex-col relative">
          {/* Subtle gold accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
        {/* Avatar Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg ring-2 ring-[#D4AF37]/20 bg-gradient-to-br from-[#77DDE7]/20 to-[#AEC6CF]/20 flex items-center justify-center">
            <Bot className="w-12 h-12 text-[#36454F]" />
          </div>
          <h3 className="text-xl text-[#36454F] mb-1">{currentAvatar.name}</h3>
          <p className="text-[#AEC6CF] text-sm mb-3">{currentAvatar.title}</p>
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full mx-auto mb-2 shadow-sm ring-1 ring-green-400/20"></div>
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

        {/* Previous Chats (for logged-in users) or Sample Questions (for anonymous users) */}
        <div>
          {isSignedIn ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[#36454F]">Previous Chats</h4>
                {chatHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 p-1"
                    onClick={loadChatHistory}
                  >
                    Refresh
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {chatHistory.length > 0 ? (
                  <>
                    {chatHistory
                      .filter(chat => chat.type === 'user')
                      .slice(-3)
                      .reverse()
                      .map((chat, index) => (
                        <Button 
                          key={chat.id}
                          variant="ghost" 
                          size="sm"
                          className="w-full text-left justify-start text-gray-600 hover:text-[#36454F] hover:bg-white/80 h-auto p-3 text-xs rounded-xl"
                          onClick={() => setMessage(chat.message)}
                        >
                          <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">"{chat.message.length > 45 ? chat.message.substring(0, 45) + '...' : chat.message}"</span>
                        </Button>
                      ))}
                    {chatHistory.filter(chat => chat.type === 'user').length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-center text-[#D4AF37] hover:text-[#D4AF37]/80 text-xs py-2"
                        onClick={() => {
                          // Could implement a modal or expand functionality here
                          console.log('View all chats clicked');
                        }}
                      >
                        View all {chatHistory.filter(chat => chat.type === 'user').length} chats
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No previous chats yet</p>
                    <p className="text-gray-400">Start a conversation to see your chat history here</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-100 bg-white/95 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-medium text-[#36454F]">Legal Assistant</h2>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="text-sm">{error}</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Anonymous Chat Notice */}
            {!isSignedIn && chatHistory.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">You're chatting anonymously. Your conversation won't be saved. <a href="/auth" className="underline hover:text-blue-800">Sign in</a> to save your chat history.</p>
                </div>
              </div>
            )}

            {/* Welcome Message */}
            {chatHistory.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#77DDE7]/20 to-[#AEC6CF]/20 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-[#36454F]" />
                </div>
                <h3 className="text-xl text-[#36454F] mb-2">Welcome to {currentAvatar.name}</h3>
                <p className="text-gray-600 mb-6">I'm here to help you with legal questions and document analysis.</p>
                
                {/* Authentication Status */}
                {!isSignedIn && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-6 max-w-md mx-auto">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" />
                      <p className="text-sm">You can chat anonymously! Sign in to save your chat history.</p>
                    </div>
                  </div>
                )}

                {isSignedIn && user && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 max-w-md mx-auto">
                    <p className="text-sm">Welcome back, {user.name}! Your messages will be saved.</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {sampleQuestions.slice(0, 4).map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-4 border-gray-200 hover:bg-gray-50 rounded-xl"
                      onClick={() => setMessage(question)}
                    >
                      <MessageCircle className="w-4 h-4 mr-3 flex-shrink-0 text-[#77DDE7]" />
                      <span className="text-sm text-gray-700">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex gap-4 ${chat.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className={`${chat.type === 'user' ? 'bg-[#AEC6CF]/20 border border-[#AEC6CF]/50' : 'bg-white border border-gray-200'} text-[#36454F]`}>
                    {chat.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[75%] ${chat.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    chat.type === 'user' 
                      ? 'bg-[#AEC6CF] text-[#36454F]' 
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
                  <p className="text-xs text-gray-500 mt-2 px-1">{chat.timestamp}</p>
                </div>
              </div>
            ))}

            {/* Loading Message */}
            {isLoading && (
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
                      <span className="text-sm text-gray-600">Thinking...</span>
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
            {/* Attached Image Preview */}
            {attachedImage && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">📷 {attachedImageName}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAttachedImage(null);
                      setAttachedImageName("");
                    }}
                    className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mt-1">Image will be analyzed when you send your message</p>
              </div>
            )}

            {/* Attached Document Preview */}
            {attachedDocument && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">📄 {attachedDocumentName}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAttachedDocument(null);
                      setAttachedDocumentName("");
                    }}
                    className="text-green-600 hover:text-green-800 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                <p className="text-xs text-green-600 mt-1">Document will be processed when you send your message</p>
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <input
                type="file"
                ref={documentInputRef}
                onChange={handleDocumentUpload}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className={`border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${attachedImage ? 'bg-blue-50 border-blue-200 text-blue-600' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !!attachedImage || !!attachedDocument}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                {attachedImage ? 'Image Attached' : 'Attach Image'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className={`border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${attachedDocument ? 'bg-green-50 border-green-200 text-green-600' : ''}`}
                onClick={() => documentInputRef.current?.click()}
                disabled={isLoading || !!attachedDocument || !!attachedImage}
              >
                <Upload className="w-4 h-4 mr-1" />
                {attachedDocument ? 'Document Attached' : 'Upload File'}
              </Button>
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  attachedImage 
                    ? "Ask a question about the attached image..." 
                    : attachedDocument 
                    ? "Ask a question about the attached document..." 
                    : "Ask your legal question or upload a document for analysis..."
                }
                className="flex-1 bg-white border-gray-200 text-[#36454F] placeholder-gray-500 resize-none rounded-2xl shadow-sm"
                rows={2}
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className={`${isListening ? 'bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] border-[#77DDE7]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'} rounded-xl h-10 w-10 p-0`}
                  onClick={() => setIsListening(!isListening)}
                  disabled={isLoading}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] shadow-sm rounded-xl h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(!message.trim() && !attachedImage && !attachedDocument) || isLoading}
                  onClick={sendMessage}
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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