import React from "react";
import { Button } from "./ui/button";
import { Scale, Users, FileText, Bot, Home, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../hooks/useAuth";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isLoggedIn?: boolean;
  userName?: string;
  onSignUp?: () => void;
  onSignIn?: () => void;
  onLogout?: () => void;
}

export default function Navigation({ 
  currentPage, 
  onPageChange, 
  isLoggedIn = false, 
  userName = "",
  onSignUp,
  onSignIn,
  onLogout 
}: NavigationProps) {
  const { user, signOut } = useAuth();
  
  // Use auth hook data if available, otherwise fall back to props
  const actualIsLoggedIn = user ? true : isLoggedIn;
  const actualUserName = user ? user.name : userName;

  const handleLogout = async () => {
    try {
      console.log('Logout initiated...');
      await signOut();
      console.log('Logout successful');
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still call onLogout even if there's an error to ensure UI updates
      if (onLogout) {
        onLogout();
      }
    }
  };
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: Bot },
    { id: 'lawyers', label: 'Find Lawyers', icon: Users },
    { id: 'community', label: 'Community', icon: FileText },
  ];

  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-xl flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-[#36454F]" />
            </div>
            <div>
              <h1 className="text-[#36454F] text-xl">Apna Lawyer</h1>
              <p className="text-xs text-gray-500 -mt-1">Understand before you sign</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentPage === item.id
                      ? "bg-[#AEC6CF]/20 text-[#36454F] shadow-sm border border-[#AEC6CF]/30"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#36454F]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Area */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 h-10 px-2 rounded-full hover:bg-gray-100 transition-colors border-0 bg-transparent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#D4AF37] text-white text-sm">
                    {actualIsLoggedIn ? getUserInitial(actualUserName) : "G"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48"
                sideOffset={5}
              >
                {actualIsLoggedIn ? (
                  <>
                    <DropdownMenuItem 
                      onClick={() => {
                        console.log('Profile clicked');
                        // TODO: Navigate to profile page
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        console.log('Settings clicked');
                        // TODO: Navigate to settings page
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem 
                    onClick={onSignIn}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}