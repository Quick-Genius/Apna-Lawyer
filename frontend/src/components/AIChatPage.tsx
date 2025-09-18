import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Footer from "./Footer";
import maleAvatar from 'figma:asset/97ff0412a73a940a79f34598c9917f35ad4f443f.png';
import femaleAvatar from 'figma:asset/88905e86ae950652136a9f44d746d3ac18fe162e.png';
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

  const avatarInfo = {
    mike: { name: "Mike", title: "Legal Expert" },
    anne: { name: "Anne", title: "Legal Advisor" }
  };

  const currentAvatar = avatarInfo[selectedAvatar as keyof typeof avatarInfo] || avatarInfo.mike;

  const sampleQuestions = [
    "What does this non-compete clause mean?",
    "Is this contract fair to both parties?",
    "What are the key risks in this agreement?",
    "Can you explain the termination clause?",
    "What should I negotiate in this contract?"
  ];

  const chatHistory = [
    {
      id: 1,
      type: "user",
      message: "Can you explain what this liability clause means in my contract?",
      timestamp: "2:45 PM"
    },
    {
      id: 2,
      type: "ai",
      message: "This liability clause limits the company's responsibility for damages to a maximum of $1,000. This means if something goes wrong due to their service, you can only recover up to $1,000, regardless of your actual losses. This is quite restrictive and may not cover significant damages. You might want to negotiate for a higher cap or remove this limitation entirely.",
      timestamp: "2:45 PM",
      confidence: 98
    },
    {
      id: 3,
      type: "user", 
      message: "That seems unfair. What should I do?",
      timestamp: "2:46 PM"
    },
    {
      id: 4,
      type: "ai",
      message: "I agree this limitation seems restrictive. Here are your options:\n\n1. **Negotiate a higher cap** - Ask for a liability cap that's proportional to the contract value\n2. **Request mutual liability** - Both parties should have similar limitations\n3. **Exclude certain damages** - Ensure the cap doesn't apply to gross negligence or willful misconduct\n4. **Add insurance requirements** - Require them to maintain adequate insurance\n\nWould you like me to help you draft language for any of these alternatives?",
      timestamp: "2:46 PM",
      confidence: 96
    }
  ];

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
          </div>
        </div>

        {/* Sticky Input Bar */}
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-sm p-6 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3">
              <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl">
                <Paperclip className="w-4 h-4 mr-1" />
                Attach Image
              </Button>
              <Button size="sm" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl">
                <Upload className="w-4 h-4 mr-1" />
                Upload File
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
                  disabled={!message.trim()}
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}