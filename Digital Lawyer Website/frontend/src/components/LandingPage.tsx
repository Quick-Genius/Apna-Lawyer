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
  Mic,
  Send
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: FileText,
      title: "Clause Simplification",
      description: "Complex legal language made simple and understandable."
    },
    {
      icon: AlertTriangle,
      title: "Risk Alerts",
      description: "Identify potential risks and red flags in your documents."
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Get legal help in multiple languages for global accessibility."
    },
    {
      icon: UserCheck,
      title: "Lawyer Referrals",
      description: "Connect with qualified lawyers when you need human expertise."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
              Your Digital Lawyer
            </h1>
            <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
              Understand legal documents before you sign, with the help of AI.
            </p>
            <Button 
              size="lg" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white mb-3">Why Choose Digital Lawyer?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered platform makes legal documents accessible and understandable for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-gray-700 bg-gray-800 shadow-lg hover:shadow-xl transition-all rounded-lg">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-gray-300" />
                    </div>
                    <h4 className="text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chat Interface Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h3 className="mb-4 text-white text-center">Ask Your Digital Lawyer</h3>
            
            {/* Sample Conversation */}
            <div className="space-y-3 mb-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">
                  "Can you explain what this non-compete clause means?"
                </p>
              </div>
              <div className="bg-gray-600 p-3 rounded-lg">
                <p className="text-sm text-gray-200">
                  "This clause prevents you from working for competitors for 2 years after leaving. This is quite restrictive and may limit your career options."
                </p>
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-gray-400">
                Type your legal question...
              </div>
              <Button size="sm" className="bg-gray-600 hover:bg-gray-500 px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Mic className="w-4 h-4 mr-2" />
                Talk to Your Digital Lawyer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-8 text-white">
            <h2 className="mb-3">Ready to Understand Your Legal Documents?</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of users who trust Digital Lawyer for their legal document needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-2 rounded-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Document
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-800 px-6 py-2 rounded-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}