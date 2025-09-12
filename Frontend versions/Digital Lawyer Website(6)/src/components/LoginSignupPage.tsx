import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ArrowLeft } from "lucide-react";
import ModernSignupPage from "./ModernSignupPage";
import ModernSigninPage from "./ModernSigninPage";

interface LoginSignupPageProps {
  onBack: () => void;
  onLawyerRegistration: () => void;
  onUserHome: () => void;
  mode?: 'signin' | 'signup';
}

export default function LoginSignupPage({ 
  onBack, 
  onLawyerRegistration, 
  onUserHome,
  mode = 'signin'
}: LoginSignupPageProps) {
  const [currentMode, setCurrentMode] = useState<'signin' | 'signup'>(mode);

  // If signup is selected, show the modern signup page
  if (currentMode === 'signup') {
    return (
      <ModernSignupPage
        onBack={onBack}
        onLawyerRegistration={onLawyerRegistration}
        onUserHome={onUserHome}
        onSwitchToLogin={() => setCurrentMode('signin')}
      />
    );
  }

  // If signin is selected, show the modern signin page
  if (currentMode === 'signin') {
    return (
      <ModernSigninPage
        onBack={onBack}
        onUserHome={onUserHome}
        onSwitchToSignup={() => setCurrentMode('signup')}
      />
    );
  }

  // Fallback (shouldn't be reached)
  return null;
}