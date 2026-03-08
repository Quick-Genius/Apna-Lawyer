import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateToLawyerRegistration}
        className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
      >
        Lawyer Registration
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Show the sign-in page (primary auth entry point)
  return (
    <>
      <ModernSigninPage
        onBack={onBack}
        onUserHome={onUserHome}
        onSwitchToSignup={() => {
          // Sign-up is handled via the sign-in page's "Sign up" link
          // which redirects within ModernSigninPage
        }}
      />
      <NavigationButtons />
    </>
  );
}