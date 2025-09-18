import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Send, 
  Paperclip,
  MoreVertical,
  Phone,
  Video
} from "lucide-react";

interface LawyerChatPageProps {
  lawyerName: string;
  lawyerImage?: string;
  lawyerSpecialization?: string;
  onBack: () => void;
}

interface Message {
  id: number;
  sender: 'user' | 'lawyer';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

export default function LawyerChatPage({ 
  lawyerName, 
  lawyerImage, 
  lawyerSpecialization = "Legal Expert",
  onBack 
}: LawyerChatPageProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'lawyer',
      content: "Hello! I'm here to help with your legal questions. What can I assist you with today?",
      timestamp: "10:30 AM"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate lawyer response after a delay
    setTimeout(() => {
      const lawyerResponse: Message = {
        id: messages.length + 2,
        sender: 'lawyer',
        content: "Thank you for your question. Let me review this and provide you with a detailed response. Could you provide any additional context that might be relevant to your situation?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, lawyerResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FCFCFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-[#36454F]" />
          </Button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <Avatar className="w-10 h-10">
                {lawyerImage ? (
                  <ImageWithFallback
                    src={lawyerImage}
                    alt={lawyerName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-[#AEC6CF] text-[#36454F]">
                    {lawyerName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-[#36454F] font-medium">{lawyerName}</h3>
              <p className="text-sm text-gray-500">Online • Typically replies in 2 hours</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Phone className="w-5 h-5 text-[#36454F]" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Video className="w-5 h-5 text-[#36454F]" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical className="w-5 h-5 text-[#36454F]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-2 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'lawyer' && (
                <Avatar className="w-6 h-6 mb-1">
                  {lawyerImage ? (
                    <ImageWithFallback
                      src={lawyerImage}
                      alt={lawyerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-[#AEC6CF] text-[#36454F] text-xs">
                      {lawyerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              
              <div className="flex flex-col">
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-[#77DDE7] text-[#36454F] rounded-br-md'
                      : 'bg-white text-[#36454F] border border-gray-100 rounded-bl-md shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  {msg.sender === 'user' && msg.status && (
                    <div className="flex">
                      <div className={`w-3 h-3 ${msg.status === 'read' ? 'text-[#77DDE7]' : 'text-gray-400'}`}>
                        <svg viewBox="0 0 16 15" fill="currentColor" className="w-full h-full">
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.371.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.132 3.006c.143.14.371.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="flex items-end gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 hover:bg-gray-100 rounded-full mb-1"
          >
            <Paperclip className="w-5 h-5 text-gray-500" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message…"
              className="bg-gray-50 border-gray-200 rounded-2xl px-4 py-3 pr-12 resize-none focus:bg-white focus:border-[#77DDE7] focus:ring-[#77DDE7]/20 transition-colors"
              style={{ minHeight: '44px' }}
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-[#77DDE7] hover:bg-[#77DDE7]/90 text-[#36454F] rounded-full p-3 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}