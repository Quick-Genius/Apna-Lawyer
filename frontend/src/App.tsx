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

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState<'user' | 'lawyer'>('user');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedLawyer, setSelectedLawyer] = useState<{
    name: string;
    image?: string;
    specialization?: string;
    responseTime?: string;
  } | null>(null);

  // Check if user has visited before
  useEffect(() => {
    const savedUser = localStorage.getItem('apna-lawyer-user');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserName(userData.name);
      setUserType(userData.type || 'user');
      // Route to dashboard if lawyer, home if user
      if (userData.type === 'lawyer') {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("home");
      }
    } else {
      setCurrentPage("home");
    }
  }, []);

  const handleRoleSelect = (role: 'lawyer' | 'user') => {
    localStorage.setItem('apna-lawyer-visited', 'true');
    setShowWelcomePopup(false);
    setUserType(role);
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
    // Simulate login with dummy data
    const userData = { name: "User", email: "user@example.com" };
    localStorage.setItem('apna-lawyer-user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name);
    setCurrentPage("home");
  };

  const handleRegistrationComplete = () => {
    // Simulate lawyer registration completion
    const userData = { name: "Dr. Smith", email: "lawyer@example.com", type: "lawyer" };
    localStorage.setItem('apna-lawyer-user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUserName(userData.name);
    setUserType("lawyer");
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
    localStorage.removeItem('apna-lawyer-user');
    setIsLoggedIn(false);
    setUserName("");
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
            userName={userName}
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

  const showNavigation = currentPage !== "welcome" && currentPage !== "login" && currentPage !== "lawyer-registration" && currentPage !== "home" && currentPage !== "dashboard" && currentPage !== "lawyer-chat" && currentPage !== "lawyer-booking";

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {showNavigation && (
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isLoggedIn={isLoggedIn}
          userName={userName}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
    </div>
  );
}