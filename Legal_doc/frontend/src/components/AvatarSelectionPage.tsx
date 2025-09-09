import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import exampleImage from 'figma:asset/50e4234ba32f3a17fa4abf21568d7e5aef2fe1a0.png';

interface AvatarSelectionPageProps {
  onSelectAvatar: (avatar: string) => void;
}

export default function AvatarSelectionPage({ onSelectAvatar }: AvatarSelectionPageProps) {
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

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl text-[#36454F] mb-6">Welcome to Apna Lawyer</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your AI-powered legal assistant that simplifies complex legal documents into clear, 
            actionable guidance. Choose your virtual assistant to get started.
          </p>
        </div>

        {/* Avatar Selection */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-[#36454F] mb-12">Choose Your Personal AI Legal Assistant</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {avatars.map((avatar, index) => (
              <Card key={avatar.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  {/* Avatar Image Container */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={exampleImage} 
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                      style={{
                        transform: index === 1 ? 'scaleX(-1)' : 'none'
                      }}
                    />
                  </div>
                  
                  <h3 className="text-2xl text-[#36454F] mb-2">{avatar.name}</h3>
                  <p className="text-[#AEC6CF] mb-4">{avatar.title}</p>
                  <p className="text-gray-600 text-sm mb-8">{avatar.description}</p>
                  
                  <Button 
                    onClick={() => onSelectAvatar(avatar.id)}
                    variant="outline"
                    className="w-full border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 py-3 rounded-xl transition-all duration-300"
                  >
                    Choose
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => onSelectAvatar("mike")}
            className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] px-16 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg"
            style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
          >
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  );
}