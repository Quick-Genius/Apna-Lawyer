import { useState } from "react";
import Navigation from "./components/Navigation";
import ComprehensiveHomePage from "./components/ComprehensiveHomePage";
import AIChatPage from "./components/AIChatPage";
import LawyersPage from "./components/LawyersPage";
import CommunityPage from "./components/CommunityPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const handleAvatarSelection = (avatar: string) => {
    setSelectedAvatar(avatar);
    setCurrentPage("chat");
  };

  const handleNavigateToLawyers = () => {
    setCurrentPage("lawyers");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <ComprehensiveHomePage 
            onSelectAvatar={handleAvatarSelection}
            onNavigateToLawyers={handleNavigateToLawyers}
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
          />
        );
    }
  };

  const showNavigation = currentPage !== "home";

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {showNavigation && (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      {renderPage()}
    </div>
  );
}