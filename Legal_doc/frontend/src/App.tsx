import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ComprehensiveHomePage from "./components/ComprehensiveHomePage";
import AIChatPage from "./components/AIChatPage";
import LawyersPage from "./components/LawyersPage";
import CommunityPage from "./components/CommunityPage";
import WelcomePopup from "./components/WelcomePopup";
import LoginSignupPage from "./components/LoginSignupPage";
import LawyerRegistrationPage from "./components/LawyerRegistrationPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('apna-lawyer-visited');
    const savedUser = localStorage.getItem('apna-lawyer-user');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsLoggedIn(true);
      setUserName(userData.name);
      setCurrentPage("home");
    } else if (!hasVisited) {
      setShowWelcomePopup(true);
    } else {
      setCurrentPage("home");
    }
  }, []);

  const handleRoleSelect = (role: 'lawyer' | 'user') => {
    localStorage.setItem('apna-lawyer-visited', 'true');
    setShowWelcomePopup(false);
    
    if (role === 'lawyer') {
      setAuthMode('signin');
      setCurrentPage("login");
    } else {
      setCurrentPage("home");
    }
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
    setCurrentPage("home");
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
    setAuthMode('signup');
    setCurrentPage("login");
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
          />
        );
      case "lawyer-registration":
        return (
          <LawyerRegistrationPage
            onBack={() => setCurrentPage("login")}
            onRegistrationComplete={handleRegistrationComplete}
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
        return <LawyersPage />;
      case "community":
        return <CommunityPage />;
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

  const showNavigation = currentPage !== "welcome" && currentPage !== "login" && currentPage !== "lawyer-registration" && currentPage !== "home";

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