import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Briefcase, MessageCircle } from "lucide-react";

interface WelcomePopupProps {
  isOpen: boolean;
  onRoleSelect: (role: 'lawyer' | 'user') => void;
}

export default function WelcomePopup({ isOpen, onRoleSelect }: WelcomePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => { }}>
      <DialogContent className="sm:max-w-2xl bg-[#FCFCFC] border border-[#AEC6CF]/20 shadow-xl p-8">
        <DialogHeader className="text-center space-y-4 mb-8">
          <DialogTitle className="text-3xl text-[#36454F] relative">
            Welcome! Please choose your
            <span className="relative ml-2">
              role
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"></div>
            </span>
          </DialogTitle>
          <DialogDescription className="text-lg text-[#6B7280]">
            Tailor your experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:border-[#D4AF37]/30 hover:scale-[1.02]"
            onClick={() => onRoleSelect('lawyer')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#D4AF37] to-[#F5E6CC] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#D4AF37]/30">
                <Briefcase className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl text-[#36454F] mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                Lawyer
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Join our network of legal professionals and connect with clients who need your expertise
              </p>

              <div className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F5E6CC] text-white rounded-xl transition-all duration-300 group-hover:from-[#D4AF37]/90 group-hover:to-[#F5E6CC]/90 group-hover:shadow-md">
                Get Started as Lawyer
              </div>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:border-[#D4AF37]/30 hover:scale-[1.02]"
            onClick={() => onRoleSelect('user')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#AEC6CF] to-[#77DDE7] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#D4AF37]/30">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl text-[#36454F] mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                User
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get instant legal guidance and connect with qualified lawyers for your legal needs
              </p>

              <div className="w-full py-4 border-2 border-[#AEC6CF] text-[#36454F] rounded-xl transition-all duration-300 group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5">
                Continue as User
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#6B7280]">
            Join thousands of users who trust Apna Lawyer
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}