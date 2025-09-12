import { Button } from "./ui/button";
import { Scale, Users, FileText, Bot, Home, User, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

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
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#D4AF37] text-white">
                        {getUserInitial(userName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  onClick={onSignIn}
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 px-6 py-2 rounded-lg"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={onSignUp}
                  className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-6 py-2 rounded-lg"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}