import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Upload, 
  MessageCircle, 
  FileText, 
  AlertTriangle, 
  Globe, 
  UserCheck,
  Shield,
  Zap,
  Clock,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: "Clause Simplification",
      description: "Transform complex legal jargon into clear, understandable language that anyone can comprehend."
    },
    {
      icon: AlertTriangle,
      title: "Risk Detection",
      description: "Automatically identify potential risks, red flags, and unfavorable terms in your legal documents."
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Get legal assistance in multiple languages with our advanced translation capabilities."
    },
    {
      icon: UserCheck,
      title: "Expert Connections",
      description: "Connect with qualified lawyers and legal experts when you need professional human guidance."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your documents are encrypted and secure. We prioritize your privacy and confidentiality."
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get immediate insights and explanations for your legal documents in seconds, not hours."
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "No more hours spent trying to understand legal terminology"
    },
    {
      icon: Shield,
      title: "Reduce Risk",
      description: "Identify potential issues before they become problems"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to a network of qualified legal professionals"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Your Document",
      description: "Simply upload any legal document - contracts, agreements, terms of service, etc."
    },
    {
      step: "2", 
      title: "AI Analysis",
      description: "Our advanced AI analyzes the document and identifies key clauses, risks, and important terms."
    },
    {
      step: "3",
      title: "Get Clear Explanations",
      description: "Receive plain-English explanations and recommendations for your legal document."
    },
    {
      step: "4",
      title: "Connect with Experts",
      description: "If needed, connect with qualified lawyers for additional guidance and support."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl mb-6 text-[#36454F]">
              Apna Lawyer
            </h1>
            <div className="w-24 h-1 bg-[#AEC6CF] mx-auto mb-6 rounded-full"></div>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your intelligent legal companion that transforms complex legal documents into clear, understandable language. 
            Make informed decisions with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 px-8 py-4 rounded-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Try AI Chat
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#36454F]">50K+</div>
              <p className="text-gray-600">Documents Analyzed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#36454F]">98%</div>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2 text-[#36454F]">24/7</div>
              <p className="text-gray-600">Available Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#36454F] mb-4">How Apna Lawyer Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent platform simplifies the legal document review process in just a few simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <Card key={index} className="border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-xl">
                <CardContent className="p-6 text-center relative">
                  <div className="w-12 h-12 bg-[#AEC6CF] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-[#36454F]">{step.step}</span>
                  </div>
                  <h4 className="text-[#36454F] mb-3">{step.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  {index < howItWorks.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-300 absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:block" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">Powerful Features for Legal Clarity</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced AI technology meets legal expertise to provide you with comprehensive document analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-gray-800 bg-gradient-to-br from-black to-gray-900 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl group hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center mb-4 border border-gray-600/50 group-hover:border-gray-500/70 transition-colors">
                      <Icon className="w-7 h-7 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-white mb-3">{feature.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">Why Choose Digital Lawyer?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transform your approach to legal documents with our intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-600/50">
                    <Icon className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="text-white mb-3">{benefit.title}</h4>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-12 text-white border border-gray-800/50 shadow-2xl">
            <h2 className="mb-4">Ready to Simplify Your Legal Documents?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of users who trust Digital Lawyer for clear, understandable legal guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-8 py-3 rounded-xl shadow-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-orange-600/50 text-orange-400 hover:bg-orange-600/10 hover:text-orange-300 hover:border-orange-500/70 px-8 py-3 rounded-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Try AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}