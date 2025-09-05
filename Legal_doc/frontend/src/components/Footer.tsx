import { Scale, Mail, Phone, MapPin, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "AI Document Analyzer", href: "#" },
        { name: "Find a Lawyer", href: "#" },
        { name: "About Us", href: "#" }
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Corporate Law News", href: "#" },
        { name: "Civil Law Updates", href: "#" },
        { name: "Join the Discussion", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Disclaimer", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-[#F5E6CC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-xl flex items-center justify-center shadow-md">
                <Scale className="w-5 h-5 text-[#36454F]" />
              </div>
              <div>
                <h3 className="text-[#36454F] text-lg">Apna Lawyer</h3>
                <p className="text-xs text-gray-600">Understand before you sign</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Empowering individuals and businesses with AI-powered legal assistance for clear, understandable legal guidance.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-600 hover:text-[#77DDE7] hover:bg-white/50 w-9 h-9 p-0 rounded-lg"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-600 hover:text-[#77DDE7] hover:bg-white/50 w-9 h-9 p-0 rounded-lg"
              >
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-[#36454F] mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-gray-600 hover:text-[#77DDE7] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Apna Lawyer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}