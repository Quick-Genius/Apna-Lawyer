import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Footer from "./Footer";
import maleAvatar from 'figma:asset/97ff0412a73a940a79f34598c9917f35ad4f443f.png';
import femaleAvatar from 'figma:asset/88905e86ae950652136a9f44d746d3ac18fe162e.png';
import { chatService, ChatMessage, ChatSession } from "../services/chatService";
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

export default function AIChatPage({ selectedAvatar = "mike" }: AIChatPageProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For speech recognition
  const recognition = useMemo(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      return recognition;
    }
    return null;
  }, []);
  
  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => (result[0] as SpeechRecognitionResult).transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const avatarInfo = {
    mike: { name: "Mike", title: "Legal Expert" },
    anne: { name: "Anne", title: "Legal Advisor" }
  };

  useEffect(() => {
    initializeChat();
    
    // Set up speech recognition handlers
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => (result[0] as SpeechRecognitionResult).transcript)
          .join('');
        setMessage(prev => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      return () => {
        recognition.stop();
      };
    }
  }, [recognition]);

  const initializeChat = async () => {
    try {
      const session = await chatService.createSession();
      setChatSession(session);
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setUploadingFile(true);
      const uploadedDoc = await chatService.uploadDocument(file);
      
      // Create a new session with the uploaded document
      const session = await chatService.createSession(uploadedDoc.id);
      setChatSession(session);
      
      // Add system message about the uploaded document
      const systemMessage: ChatMessage = {
        id: Date.now(),
        type: 'ai',
        message: `I've analyzed the document "${file.name}". You can now ask me questions about it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 100
      };
      
      setChatMessages([systemMessage]);
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleMicClick = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sendMessage = async () => {
    if (!message.trim() || !chatSession || isLoading) return;

    setIsLoading(true);
    const newMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      setChatMessages(prev => [...prev, newMessage]);
      setMessage("");

      const response = await chatService.sendMessage(chatSession.id, newMessage.message);
      
      const aiResponse: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: response.confidence
      };

      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const currentAvatar = avatarInfo[selectedAvatar as keyof typeof avatarInfo] || avatarInfo.mike;

  const sampleQuestions = [
    "What does this non-compete clause mean?",
    "Is this contract fair to both parties?",
    "What are the key risks in this agreement?",
    "Can you explain the termination clause?",
    "What should I negotiate in this contract?"
  ];

  const chatHistory = chatMessages;

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
        <div className="w-80 bg-gradient-to-b from-[#F9FAFB] to-[#F9FAFB]/95 border-r border-gray-100 p-6 flex flex-col relative">
          {/* Subtle gold accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
        {/* Avatar Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg ring-2 ring-[#D4AF37]/20">
            <img 
              src={selectedAvatar === 'anne' ? femaleAvatar : maleAvatar} 
              alt={currentAvatar.name}
              className="w-full h-full object-cover object-center"
            />
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
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-gray-500 hover:text-green-500"
                            onClick={() => {
                              // Here you can implement feedback functionality
                              console.log('Positive feedback for message:', chat.id);
                            }}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
                            onClick={() => {
                              // Here you can implement feedback functionality
                              console.log('Negative feedback for message:', chat.id);
                            }}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                            onClick={() => copyToClipboard(chat.message)}
                          >
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
                style={{ display: 'none' }}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
              >
                <Upload className="w-4 h-4 mr-1" />
                {uploadingFile ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
            
            <div className="flex gap-3 items-end">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                  onClick={sendMessage}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#36454F] border-t-transparent" />
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