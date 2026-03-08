import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import WelcomePopup from './components/WelcomePopup';
import LoginSignupPage from './components/LoginSignupPage';
import LawyerDashboard from './components/LawyerDashboard';
import LawyerRegistrationPage from './components/LawyerRegistrationPage';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './styles/globals.css';

type AppPage = 'welcome' | 'login' | 'lawyer-registration' | 'user-home' | 'lawyer-dashboard' | 'avatar-selection';

// Placeholder components for user home pages
function UserHomePage({ onNavigateToLogin, onNavigateToChat, onLogout }: {
  onNavigateToLogin: () => void;
  onNavigateToChat: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F5E6CC]/30">
      <Navigation
        currentPage="home"
        onPageChange={(page) => {
          if (page === 'login') onNavigateToLogin();
          if (page === 'chat') onNavigateToChat();
        }}
        isLoggedIn={true}
        userName="User"
        onLogout={onLogout}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mt-20">
          <h1 className="text-4xl font-bold text-[#36454F]">Welcome to Apna Lawyer</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant legal guidance from AI and connect with qualified lawyers
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={onNavigateToChat}
              className="px-8 py-3 bg-[#D4AF37] hover:bg-[#B8941F] text-white font-semibold rounded-xl transition"
            >
              Start Chat with AI
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  const { isSignedIn, user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('welcome');
  const [selectedRole, setSelectedRole] = useState<'lawyer' | 'user' | null>(null);

  // Check if user is authenticated and route accordingly
  useEffect(() => {
    if (!loading) {
      if (isSignedIn && user) {
        // User is authenticated, route based on user type
        if (selectedRole === 'lawyer') {
          setCurrentPage('lawyer-dashboard');
        } else {
          setCurrentPage('user-home');
        }
      } else {
        // User is not authenticated, show welcome/login
        setCurrentPage('welcome');
      }
    }
  }, [isSignedIn, user, loading, selectedRole]);

  // Handle role selection
  const handleRoleSelect = (role: 'lawyer' | 'user') => {
    setSelectedRole(role);
    if (role === 'lawyer') {
      setCurrentPage('lawyer-registration');
    } else {
      setCurrentPage('login');
    }
  };

  // Navigation handlers
  const handleNavigateToLogin = () => {
    setSelectedRole('user');
    setCurrentPage('login');
  };

  const handleNavigateToLawyerReg = () => {
    setSelectedRole('lawyer');
    setCurrentPage('lawyer-registration');
  };

  const handleNavigateToHome = () => {
    if (isSignedIn && user) {
      setCurrentPage(selectedRole === 'lawyer' ? 'lawyer-dashboard' : 'user-home');
    } else {
      setCurrentPage('welcome');
    }
  };

  const handleLogout = () => {
    setCurrentPage('welcome');
    setSelectedRole(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FCFCFC] to-[#F5E6CC]/30">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto"></div>
          <p className="text-[#36454F] text-lg">Loading Apna Lawyer...</p>
        </div>
      </div>
    );
  }

  // Render appropriate page
  switch (currentPage) {
    case 'welcome':
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#FCFCFC] to-[#F5E6CC]/30">
          <WelcomePopup
            isOpen={!isSignedIn && currentPage === 'welcome'}
            onRoleSelect={handleRoleSelect}
          />
        </div>
      );

    case 'login':
      return (
        <LoginSignupPage
          onBack={handleNavigateToHome}
          onLawyerRegistration={handleNavigateToLawyerReg}
          onUserHome={handleNavigateToHome}
          mode="signin"
          onNavigateToHome={handleNavigateToHome}
          onNavigateToSignIn={handleNavigateToLogin}
          onNavigateToSignUp={() => setCurrentPage('login')}
          onNavigateToLawyerRegistration={handleNavigateToLawyerReg}
        />
      );

    case 'lawyer-registration':
      return (
        <LawyerRegistrationPage
          onBack={handleNavigateToHome}
          onRegistrationComplete={() => setCurrentPage('attorney-dashboard')}
          onNavigateToSignIn={handleNavigateToLogin}
          onNavigateToSignUp={handleNavigateToLogin}
          onNavigateToDashboard={() => setCurrentPage('lawyer-dashboard')}
          onNavigateToHome={handleNavigateToHome}
        />
      );

    case 'lawyer-dashboard':
      // Auth guard: redirect unauthenticated users
      if (!isSignedIn || !user) {
        setCurrentPage('welcome');
        return null;
      }
      return (
        <LawyerDashboard
          userName={user?.name || 'Lawyer'}
          onLogout={handleLogout}
          onNavigateToSignIn={handleNavigateToLogin}
          onNavigateToSignUp={handleNavigateToLogin}
          onNavigateToLawyerRegistration={handleNavigateToLawyerReg}
          onNavigateToHome={handleNavigateToHome}
        />
      );

    case 'user-home':
      // Auth guard: redirect unauthenticated users
      if (!isSignedIn || !user) {
        setCurrentPage('welcome');
        return null;
      }
      return (
        <UserHomePage
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToChat={() => {
            // TODO: Navigate to chat page
            console.log('Navigating to chat');
          }}
          onLogout={handleLogout}
        />
      );

    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#36454F] mb-4">Page Not Found</h1>
            <button
              onClick={handleNavigateToHome}
              className="px-6 py-2 bg-[#D4AF37] hover:bg-[#B8941F] text-white rounded-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
  }
}
