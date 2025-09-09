import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  X, 
  MessageCircle, 
  Video, 
  Calendar, 
  Send, 
  Phone,
  Clock
} from "lucide-react";

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName?: string;
}

export default function ChatBox({ isOpen, onClose, lawyerName = "Legal Expert" }: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"chat" | "video" | "schedule">("chat");

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  const handleStartVideoCall = () => {
    // Handle starting video call
    alert("Video call functionality would be integrated with your preferred video service (Zoom, Google Meet, etc.)");
  };

  const handleScheduleConsultation = () => {
    // Handle scheduling
    alert("Consultation scheduled! You'll receive a confirmation email shortly.");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#AEC6CF] to-[#77DDE7] text-[#36454F] p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact {lawyerName}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-[#36454F] hover:bg-white/20 p-1 h-auto"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 p-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === "chat" 
                  ? "bg-[#AEC6CF]/20 text-[#36454F] border-b-2 border-[#AEC6CF]" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 p-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === "video" 
                  ? "bg-[#AEC6CF]/20 text-[#36454F] border-b-2 border-[#AEC6CF]" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Video className="w-4 h-4" />
              Video Call
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 p-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                activeTab === "schedule" 
                  ? "bg-[#AEC6CF]/20 text-[#36454F] border-b-2 border-[#AEC6CF]" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="p-4 space-y-4">
              <div className="bg-[#F9FAFB] rounded-lg p-3">
                <p className="text-sm text-[#36454F]">
                  Hello! I'm here to help with your legal questions. What can I assist you with today?
                </p>
              </div>
              
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none border-gray-200 focus:border-[#AEC6CF] rounded-xl"
                  rows={3}
                />
                
                <Button 
                  onClick={handleSendMessage}
                  className="w-full bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] rounded-xl"
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}

          {/* Video Call Tab */}
          {activeTab === "video" && (
            <div className="p-4 space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#AEC6CF] to-[#77DDE7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-[#36454F]" />
                </div>
                <h3 className="text-[#36454F] mb-2">Start Video Consultation</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Connect instantly for a face-to-face consultation with {lawyerName}
                </p>
                
                <div className="space-y-3">
                  <Button 
                    onClick={handleStartVideoCall}
                    className="w-full bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] rounded-xl py-3"
                    style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Start Video Call Now
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 rounded-xl py-3"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Audio Call Only
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="p-4 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#36454F] mb-2">Preferred Date & Time</label>
                  <Input
                    type="datetime-local"
                    className="border-gray-200 focus:border-[#AEC6CF] rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-[#36454F] mb-2">Consultation Type</label>
                  <select className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#AEC6CF]">
                    <option value="video">Video Consultation</option>
                    <option value="phone">Phone Consultation</option>
                    <option value="in-person">In-Person Meeting</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-[#36454F] mb-2">Brief Description</label>
                  <Textarea
                    placeholder="Briefly describe your legal matter..."
                    className="resize-none border-gray-200 focus:border-[#AEC6CF] rounded-xl"
                    rows={3}
                  />
                </div>
                
                <div className="bg-[#F5E6CC]/50 rounded-xl p-3 border border-[#F5E6CC]">
                  <div className="flex items-center gap-2 text-sm text-[#36454F]">
                    <Clock className="w-4 h-4" />
                    <span>Typical response time: Within 2 hours</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleScheduleConsultation}
                  className="w-full bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] rounded-xl py-3"
                  style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}