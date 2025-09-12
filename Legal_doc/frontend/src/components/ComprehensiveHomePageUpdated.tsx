import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Footer from "./Footer";
import maleAvatar from 'figma:asset/97ff0412a73a940a79f34598c9917f35ad4f443f.png';
import femaleAvatar from 'figma:asset/88905e86ae950652136a9f44d746d3ac18fe162e.png';
import backgroundImage from 'figma:asset/78ee38db44766290dfe8abd673268b14928c5d43.png';
import { 
  Upload, 
  Sparkles, 
  Users, 
  Scale,
  Star,
  MapPin,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Github,
  FileText,
  UserCheck,
  ArrowRight
} from "lucide-react";

interface ComprehensiveHomePageProps {
  onSelectAvatar: (avatar: string) => void;
  onNavigateToLawyers: () => void;
  onGetStarted: () => void;
}

export default function ComprehensiveHomePage({ onSelectAvatar, onNavigateToLawyers, onGetStarted }: ComprehensiveHomePageProps) {
  const avatars = [
    {
      id: "mike",
      name: "Mike",
      title: "Legal Expert", 
      description: "Professional male assistant"
    },
    {
      id: "anne",
      name: "Anne", 
      title: "Legal Advisor",
      description: "Professional female assistant"
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Upload Your Document",
      description: "Securely upload any contract, notice, or agreement.",
      icon: Upload
    },
    {
      number: "2", 
      title: "Get an AI Summary",
      description: "Our AI analyzes the text and gives you a simple, jargon-free explanation.",
      icon: Sparkles
    },
    {
      number: "3",
      title: "Connect with a Pro", 
      description: "If you need more help, connect with a qualified lawyer.",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-xl flex items-center justify-center shadow-md relative">
                <Scale className="w-5 h-5 text-[#36454F] relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-[#36454F] text-xl">Apna Lawyer</h1>
                <p className="text-xs text-gray-500 -mt-1">Understand before you <span className="text-[#D4AF37]/80">sign</span></p>
              </div>
            </div>

            {/* Get Started Button */}
            <div className="flex items-center">
              <Button 
                onClick={onGetStarted}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section 1: Hero & Avatar Selection */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Light Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FCFCFC] via-[#F8F9FA] to-[#F1F3F4] pointer-events-none"></div>
        {/* Background Image with lighter overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: 0.3
          }}
        ></div>
        {/* Very subtle gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/2 via-transparent to-[#D4AF37]/1 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-6xl text-[#36454F] mb-6 relative">
            Choose Your Personal <span className="relative">AI Legal Assistant
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"></div>
            </span>
          </h1>
          
          {/* Sub-headline */}
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Get instant summaries of complex legal documents and clear answers to your questions.
          </p>

          {/* Avatar Selection */}
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto mb-12">
            {avatars.map((avatar, index) => (
              <Card key={avatar.id} className="bg-white/90 backdrop-blur-sm border border-gray-100/50 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all duration-300 group cursor-pointer hover:border-[#D4AF37]/20">
                <CardContent className="p-8 text-center">
                  {/* Avatar Image Container */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg transition-all duration-300 ring-2 ring-[#D4AF37]/20 group-hover:ring-[#D4AF37]/40">
                    <img 
                      src={avatar.id === "mike" ? maleAvatar : femaleAvatar} 
                      alt={avatar.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  
                  <h3 className="text-2xl text-[#36454F] mb-2">{avatar.name}</h3>
                  <p className="text-[#AEC6CF] mb-4">{avatar.title}</p>
                  <p className="text-gray-600 text-sm mb-8">{avatar.description}</p>
                  
                  <Button 
                    onClick={() => onSelectAvatar(avatar.id)}
                    variant="outline"
                    className="w-full border-[#AEC6CF] text-[#36454F] hover:bg-gradient-to-r hover:from-[#AEC6CF]/10 hover:to-[#D4AF37]/10 py-3 rounded-xl transition-all duration-300 group-hover:border-[#D4AF37]/30"
                  >
                    Choose
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Primary CTA */}
          <Button 
            size="lg"
            onClick={() => onSelectAvatar("mike")}
            className="bg-[#77DDE7] hover:bg-[#77DDE7]/90 text-[#36454F] px-16 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg"
            style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
          >
            Start Chatting Now
          </Button>
        </div>
      </section>

      {/* Section 2: Feature Highlight - Find the Right Lawyer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Lawyer Marketplace Mockup */}
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#AEC6CF]/20 to-[#77DDE7]/20 rounded-3xl blur-xl"></div>
              
              <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {/* Browser-like header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-lg px-3 py-1 text-xs text-gray-500">
                      apnalawyer.com/lawyers
                    </div>
                  </div>
                  <h4 className="text-[#36454F] text-lg">Find Legal Experts</h4>
                </div>
                
                {/* Search bar mockup */}
                <div className="bg-[#F9FAFB] rounded-xl p-3 mb-4 flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded flex-1"></div>
                  <div className="w-16 h-6 bg-[#77DDE7] rounded"></div>
                </div>
                
                {/* Mock Lawyer Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Sarah J.", rating: "4.9", specialty: "Corporate" },
                    { name: "Amit K.", rating: "4.8", specialty: "Family" },
                    { name: "Priya S.", rating: "4.9", specialty: "Criminal" },
                    { name: "Rajesh M.", rating: "4.7", specialty: "Property" }
                  ].map((lawyer, i) => (
                    <div key={i} className="bg-[#F9FAFB] rounded-xl p-4 hover:bg-white hover:shadow-sm transition-all duration-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-full mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full"></div>
                      </div>
                      <div className="h-3 bg-[#36454F] rounded mb-2 w-3/4" style={{background: '#36454F'}}></div>
                      <div className="h-2 bg-[#AEC6CF] rounded mb-3 w-1/2"></div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">{lawyer.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>Mumbai, IN</span>
                      </div>
                      <div className="mt-3 w-full h-6 bg-[#77DDE7] rounded text-xs flex items-center justify-center text-[#36454F]">
                        Contact
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load more indicator */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-[#AEC6CF] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Text Content */}
            <div>
              <p className="text-[#AEC6CF] text-sm uppercase tracking-wide mb-4">Expert Legal Advice is Just a Click Away</p>
              <h2 className="text-4xl lg:text-5xl text-[#36454F] mb-6">
                Find the Right Lawyer, Instantly.
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Browse our network of verified legal professionals. Filter by specialization and location to book an affordable consultation with the perfect lawyer for your needs.
              </p>
              <Button 
                onClick={onNavigateToLawyers}
                variant="outline"
                className="border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 px-8 py-3 rounded-xl transition-all duration-300"
              >
                Browse Lawyers
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl text-[#36454F] mb-6">
              Get Clarity in Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes understanding legal documents simple and accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {/* Step Number & Icon */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-full flex items-center justify-center mx-auto shadow-lg relative">
                      <Icon className="w-10 h-10 text-[#36454F]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full"></div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#77DDE7] to-[#D4AF37]/20 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-[#36454F] text-sm font-medium">{step.number}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <h3 className="text-xl text-[#36454F] mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-12 h-px bg-gradient-to-r from-[#AEC6CF] to-transparent transform -translate-x-6"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#F9FAFB] to-[#F5E6CC] relative">
        {/* Subtle gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#D4AF37]/10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl text-[#36454F] mb-6">
            Ready to Understand Your Legal Documents?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Apna Lawyer for clear, understandable legal guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => onSelectAvatar("mike")}
              className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
            <Button 
              onClick={onNavigateToLawyers}
              variant="outline"
              size="lg"
              className="border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 px-8 py-4 rounded-xl transition-all duration-300"
            >
              <Users className="w-5 h-5 mr-2" />
              Find a Lawyer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}