import { useState, useEffect, useRef } from "react";
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
  AlertCircle
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
  const [extractedText, setExtractedText] = useState<string>("");
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
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't show error for 403 Forbidden when not signed in
      if (err instanceof Error && !err.message.includes('sign in')) {
        setError('Failed to load chat history');
      }
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to chat
    const userChatMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: userMessage,
      timestamp
    };
    
    setChatHistory(prev => [...prev, userChatMessage]);
    setMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendMessage(userMessage);
      
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

    setIsLoading(true);
    setError(null);

    try {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add user message indicating file upload
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        message: `📷 Uploaded image: ${file.name}`,
        timestamp
      };
      setChatHistory(prev => [...prev, userMessage]);

      // Extract text from image using OCR
      const ocrResponse = await apiService.ocrImage(file);
      
      if (ocrResponse.success && ocrResponse.extracted_text) {
        // Set extracted text in the input for user review
        setExtractedText(ocrResponse.extracted_text);
        setMessage(`Extracted text from image:\n\n${ocrResponse.extracted_text}\n\nPlease analyze this document.`);
        
        // Add extracted text message
        const extractedMessage: ChatMessage = {
          id: `extracted-${Date.now()}`,
          type: 'ai',
          message: `✅ Text extracted from image:\n\n${ocrResponse.extracted_text}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, extractedMessage]);
      } else {
        setError('No text could be extracted from the image');
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

    setIsLoading(true);
    setError(null);

    try {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add user message indicating file upload
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        message: `📄 Uploaded document: ${file.name}`,
        timestamp
      };
      setChatHistory(prev => [...prev, userMessage]);

      // Extract text from document
      const docResponse = await apiService.extractTextFromDocument(file);
      
      if (docResponse.success && docResponse.extracted_text) {
        // Set extracted text in the input for user review
        setExtractedText(docResponse.extracted_text);
        setMessage(`Extracted text from document:\n\n${docResponse.extracted_text}\n\nPlease analyze this document.`);
        
        // Add extracted text message
        const extractedMessage: ChatMessage = {
          id: `extracted-${Date.now()}`,
          type: 'ai',
          message: `✅ Text extracted from document:\n\n${docResponse.extracted_text.substring(0, 500)}${docResponse.extracted_text.length > 500 ? '...' : ''}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, extractedMessage]);
      } else {
        setError('No text could be extracted from the document');
      }
    } catch (err) {
      console.error('Failed to process document:', err);
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
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
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Attach Image
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => documentInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-1" />
                Upload File
              </Button>
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your legal question or upload a document for analysis..."
                className="flex-1 bg-white border-gray-200 text-[#36454F] placeholder-gray-500 resize-none rounded-2xl shadow-sm"
                rows={extractedText ? 6 : 2}
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
                  disabled={!message.trim() || isLoading}
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