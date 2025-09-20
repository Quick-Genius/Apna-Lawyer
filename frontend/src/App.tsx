import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ComprehensiveHomePage from "./components/ComprehensiveHomePage";
import AIChatPage from "./components/AIChatPage";
import LawyersPage from "./components/LawyersPage";
import CommunityPage from "./components/CommunityPage";
import LawyerChatPage from "./components/LawyerChatPage";
import LawyerBookingPage from "./components/LawyerBookingPage";
import WelcomePopup from "./components/WelcomePopup";
import LoginSignupPage from "./components/LoginSignupPage";
import LawyerRegistrationPage from "./components/LawyerRegistrationPage";
import LawyerDashboard from "./components/LawyerDashboard";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isSignedIn, user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedLawyer, setSelectedLawyer] = useState<{
    name: string;
    image?: string;
    specialization?: string;
    responseTime?: string;
  } | null>(null);

  // Check authentication status and route accordingly
  useEffect(() => {
    if (!loading) {
      if (isSignedIn && user) {
        // Route to dashboard if lawyer, home if user
        if (user.is_lawyer) {
          setCurrentPage("dashboard");
        } else {
          setCurrentPage("home");
        }
      } else {
        setCurrentPage("home");
      }
    }
  }, [isSignedIn, user, loading]);

  const handleRoleSelect = (role: 'lawyer' | 'user') => {
    localStorage.setItem('apna-lawyer-visited', 'true');
    setShowWelcomePopup(false);
    setAuthMode('signin');
    setCurrentPage("login");
  };

  const handleBackToWelcome = () => {
    setCurrentPage("welcome");
    setShowWelcomePopup(true);
  };

  const handleLawyerRegistration = () => {
    setCurrentPage("lawyer-registration");
  };

  const handleUserHome = () => {
    // Navigate to home page (user is already authenticated via auth service)
    setCurrentPage("home");
  };

  const handleRegistrationComplete = () => {
    // Navigate to dashboard (user is already authenticated via auth service)
    setCurrentPage("dashboard");
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setCurrentPage("login");
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setCurrentPage("login");
  };

  const handleLogout = () => {
    // Logout is handled by the useAuth hook
    setCurrentPage("home");
  };

  const handleAvatarSelection = (avatar: string) => {
    setSelectedAvatar(avatar);
    setCurrentPage("chat");
  };

  const handleNavigateToLawyers = () => {
    setCurrentPage("lawyers");
  };

  const handleGetStarted = () => {
    setShowWelcomePopup(true);
    setCurrentPage("welcome");
  };

  // Navigation handlers for evaluator flow
  const handleNavigateToSignIn = () => {
    setAuthMode('signin');
    setCurrentPage("login");
  };

  const handleNavigateToSignUp = () => {
    setAuthMode('signup');
    setCurrentPage("login");
  };

  const handleNavigateToLawyerRegistration = () => {
    setCurrentPage("lawyer-registration");
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleNavigateToHome = () => {
    setCurrentPage("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "welcome":
        return (
          <WelcomePopup 
            isOpen={showWelcomePopup} 
            onRoleSelect={handleRoleSelect} 
          />
        );
      case "login":
        return (
          <LoginSignupPage
            onBack={handleBackToWelcome}
            onLawyerRegistration={handleLawyerRegistration}
            onUserHome={handleUserHome}
            mode={authMode}
            onNavigateToSignIn={handleNavigateToSignIn}
            onNavigateToSignUp={handleNavigateToSignUp}
            onNavigateToLawyerRegistration={handleNavigateToLawyerRegistration}
            onNavigateToHome={handleNavigateToHome}
          />
        );
      case "lawyer-registration":
        return (
          <LawyerRegistrationPage
            onBack={() => setCurrentPage("login")}
            onRegistrationComplete={handleRegistrationComplete}
            onNavigateToSignIn={handleNavigateToSignIn}
            onNavigateToSignUp={handleNavigateToSignUp}
            onNavigateToDashboard={handleNavigateToDashboard}
            onNavigateToHome={handleNavigateToHome}
          />
        );
      case "dashboard":
        return (
          <LawyerDashboard 
            userName={user?.name || ""}
            onLogout={handleLogout}
            onNavigateToSignIn={handleNavigateToSignIn}
            onNavigateToSignUp={handleNavigateToSignUp}
            onNavigateToLawyerRegistration={handleNavigateToLawyerRegistration}
            onNavigateToHome={handleNavigateToHome}
          />
        );
      case "home":
        return (
          <ComprehensiveHomePage 
            onSelectAvatar={handleAvatarSelection}
            onNavigateToLawyers={handleNavigateToLawyers}
            onGetStarted={handleGetStarted}
          />
        );
      case "chat":
        return <AIChatPage selectedAvatar={selectedAvatar || "mike"} />;
      case "lawyers":
        return (
          <LawyersPage 
            onLawyerChat={(lawyer) => {
              setSelectedLawyer(lawyer);
              setCurrentPage("lawyer-chat");
            }}
            onLawyerBooking={(lawyer) => {
              setSelectedLawyer(lawyer);
              setCurrentPage("lawyer-booking");
            }}
          />
        );
      case "community":
        return <CommunityPage />;
      case "lawyer-chat":
        return (
          <LawyerChatPage 
            lawyerName={selectedLawyer?.name || "Legal Expert"}
            lawyerImage={selectedLawyer?.image}
            lawyerSpecialization={selectedLawyer?.specialization}
            onBack={() => setCurrentPage("lawyers")}
          />
        );
      case "lawyer-booking":
        return (
          <LawyerBookingPage 
            lawyerName={selectedLawyer?.name || "Legal Expert"}
            lawyerImage={selectedLawyer?.image}
            lawyerSpecialization={selectedLawyer?.specialization}
            responseTime={selectedLawyer?.responseTime}
            onBack={() => setCurrentPage("lawyers")}
          />
        );
      default:
        return (
          <ComprehensiveHomePage 
            onSelectAvatar={handleAvatarSelection}
            onNavigateToLawyers={handleNavigateToLawyers}
            onGetStarted={handleGetStarted}
          />
        );
    }
  };

  const showNavigation = currentPage === "chat" || currentPage === "lawyers" || currentPage === "community";

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#36454F]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {showNavigation && (
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isLoggedIn={isSignedIn}
          userName={user?.name || ""}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}