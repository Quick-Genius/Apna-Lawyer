import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Calendar,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface LawyerBookingPageProps {
  lawyerName: string;
  lawyerImage?: string;
  lawyerSpecialization?: string;
  responseTime?: string;
  onBack: () => void;
}

export default function LawyerBookingPage({ 
  lawyerName, 
  lawyerImage, 
  lawyerSpecialization = "Legal Expert",
  responseTime = "2 hours",
  onBack 
}: LawyerBookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [description, setDescription] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const minute = time.split(':')[1];
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && date.getDay() !== 0; // Not Sunday and not in the past
  };

  const handleDateSelect = (date: Date | null) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      setSelectedTime(""); // Reset time selection when date changes
    }
  };

  const handleScheduleMeeting = async () => {
    if (!selectedDate || !selectedTime || !description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Reset form and go back after showing success
      setTimeout(() => {
        onBack();
      }, 3000);
    }, 2000);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (submitSuccess) {
    return (
      <div className="flex flex-col h-screen bg-[#FCFCFC]">
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-[#36454F] mb-2">Meeting Scheduled Successfully!</h3>
              <p className="text-gray-600 text-sm mb-4">
                You'll receive a confirmation email with meeting details shortly.
              </p>
              <p className="text-gray-500 text-sm">
                Redirecting you back...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#FCFCFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 shadow-sm">
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
            
            <div>
              <h3 className="text-[#36454F] font-medium">{lawyerName}</h3>
              <p className="text-sm text-gray-500">{lawyerSpecialization}</p>
            </div>
          </div>

          <div className="bg-[#D4AF37]/10 px-3 py-2 rounded-lg">
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Calendar Section */}
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <h4 className="text-[#36454F] font-medium mb-4">Select Date</h4>
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h5 className="text-[#36454F] font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h5>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                const isSelected = selectedDate && date && 
                  date.toDateString() === selectedDate.toDateString();
                const isAvailable = date && isDateAvailable(date);
                
                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    disabled={!isAvailable}
                    className={`
                      p-3 text-sm rounded-xl transition-all duration-200
                      ${!date ? 'invisible' : ''}
                      ${isSelected 
                        ? 'bg-[#D4AF37] text-white shadow-md' 
                        : isAvailable 
                          ? 'hover:bg-gray-100 text-[#36454F]' 
                          : 'text-gray-300 cursor-not-allowed'
                      }
                    `}
                  >
                    {date?.getDate()}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Time Slots Section */}
        {selectedDate && (
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <h4 className="text-[#36454F] font-medium mb-4">Available Times</h4>
              <p className="text-sm text-gray-600 mb-4">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      p-3 text-sm rounded-xl border transition-all duration-200
                      ${selectedTime === time
                        ? 'bg-[#D4AF37] text-white border-[#D4AF37] shadow-md'
                        : 'bg-white text-[#36454F] border-gray-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5'
                      }
                    `}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Description Section */}
        {selectedTime && (
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <h4 className="text-[#36454F] font-medium mb-4">Brief Description</h4>
              <Textarea
                placeholder="Briefly describe your legal matter..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 border-gray-200 rounded-xl min-h-[100px] resize-none focus:bg-white focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-colors"
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Section */}
      {selectedDate && selectedTime && description.trim() && (
        <div className="bg-white border-t border-gray-100 px-4 py-4">
          <div className="bg-[#F5E6CC]/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-[#36454F]">
              <Clock className="w-4 h-4" />
              <span>Typical response time: Within {responseTime}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleScheduleMeeting}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white py-4 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Confirm & Schedule
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}