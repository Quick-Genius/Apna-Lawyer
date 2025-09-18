import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ModernSignupPage from "./ModernSignupPage";
import ModernSigninPage from "./ModernSigninPage";

interface LoginSignupPageProps {
  onBack: () => void;
  onLawyerRegistration: () => void;
  onUserHome: () => void;
  mode?: 'signin' | 'signup';
  onNavigateToSignIn?: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToLawyerRegistration?: () => void;
  onNavigateToHome?: () => void;
}

export default function LoginSignupPage({ 
  onBack, 
  onLawyerRegistration, 
  onUserHome,
  mode = 'signin',
  onNavigateToSignIn,
  onNavigateToSignUp,
  onNavigateToLawyerRegistration,
  onNavigateToHome
}: LoginSignupPageProps) {
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode);

  // Navigation component
  const NavigationButtons = () => (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateToHome}
        className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
      >
        <ChevronLeft className="w-4 h-4" />
        Home
      </Button>
      
      {currentMode === 'signin' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMode('signup')}
          className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
        >
          Sign Up
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
      
      {currentMode === 'signup' && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToLawyerRegistration}
          className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
        >
          Lawyer Registration
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  // If signup is selected, show the modern signup page
  if (currentMode === 'signup') {
    return (
      <>
        <ModernSignupPage
          onBack={onBack}
          onLawyerRegistration={onLawyerRegistration}
          onUserHome={onUserHome}
          onSwitchToLogin={() => setCurrentMode('signin')}
        />
        <NavigationButtons />
      </>
    );
  }

  // If signin is selected, show the modern signin page
  if (currentMode === 'signin') {
    return (
      <>
        <ModernSigninPage
          onBack={onBack}
          onUserHome={onUserHome}
          onSwitchToSignup={() => setCurrentMode('signup')}
        />
        <NavigationButtons />
      </>
    );
  }

  // Fallback (shouldn't be reached)
  return null;
}