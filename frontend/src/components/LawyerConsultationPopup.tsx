import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { 
  X, 
  MessageCircle, 
  Calendar,
  Clock,
  CheckCircle 
} from "lucide-react";

interface LawyerConsultationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName: string;
  onStartChat: () => void;
}

export default function LawyerConsultationPopup({ 
  isOpen, 
  onClose, 
  lawyerName,
  onStartChat 
}: LawyerConsultationPopupProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'schedule'>('chat');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Reset form and close after showing success
      setTimeout(() => {
        setSubmitSuccess(false);
        setSelectedDate('');
        setSelectedTime('');
        setDescription('');
        setActiveTab('chat');
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleStartChat = () => {
    onStartChat();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#77DDE7] to-[#AEC6CF] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <h2 className="text-xl font-medium">Contact {lawyerName}</h2>
          </div>
        </div>

        <CardContent className="p-0">
          {submitSuccess ? (
            <div className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#36454F] mb-2">Meeting Scheduled!</h3>
              <p className="text-gray-600 text-sm">
                You'll receive a confirmation shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Tab Buttons */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'text-[#77DDE7] border-b-2 border-[#77DDE7] bg-[#77DDE7]/5'
                      : 'text-gray-600 hover:text-[#36454F] hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex-1 py-4 px-6 font-medium transition-colors ${
                    activeTab === 'schedule'
                      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[#D4AF37]/5'
                      : 'text-gray-600 hover:text-[#36454F] hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Schedule Meeting
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'chat' ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-[#77DDE7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-[#77DDE7]" />
                      </div>
                      <h3 className="text-lg font-medium text-[#36454F] mb-2">
                        Start a conversation with {lawyerName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Get immediate responses to your legal questions through our secure chat platform.
                      </p>
                      <div className="bg-[#F5E6CC]/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#36454F]">
                          <Clock className="w-4 h-4" />
                          <span>Typical response time: Within 2 hours</span>
                        </div>
                      </div>
                      <Button 
                        onClick={handleStartChat}
                        className="w-full bg-[#77DDE7] hover:bg-[#77DDE7]/90 text-[#36454F] py-3 rounded-xl shadow-sm transition-all duration-200"
                        style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-[#36454F] font-medium mb-3">
                        Preferred Date & Time
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl"
                        />
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 outline-none"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>
                              {time === '09:00' ? '9:00 AM' :
                               time === '10:00' ? '10:00 AM' :
                               time === '11:00' ? '11:00 AM' :
                               time === '14:00' ? '2:00 PM' :
                               time === '15:00' ? '3:00 PM' :
                               time === '16:00' ? '4:00 PM' :
                               '5:00 PM'}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[#36454F] font-medium mb-3">
                        Brief Description
                      </label>
                      <Textarea
                        placeholder="Briefly describe your legal matter..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 rounded-xl min-h-[100px] resize-none"
                      />
                    </div>

                    {/* Response Time Info */}
                    <div className="bg-[#F5E6CC]/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-sm text-[#36454F]">
                        <Clock className="w-4 h-4" />
                        <span>Typical response time: Within 2 hours</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      onClick={handleScheduleMeeting}
                      disabled={isSubmitting || !selectedDate || !selectedTime || !description.trim()}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white py-3 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4 mr-2" />
                          Confirm & Schedule
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}