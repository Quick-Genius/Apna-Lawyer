import { Button } from "./ui/button";
import { Scale, Users, FileText, Bot, Home, Globe } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: Bot },
    { id: 'lawyers', label: 'Find Lawyers', icon: Users },
    { id: 'community', label: 'Community', icon: FileText },
  ];

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

          {/* Language Selector */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#36454F] hover:bg-gray-50 rounded-lg">
              <Globe className="w-4 h-4 mr-1" />
              हिंदी
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}