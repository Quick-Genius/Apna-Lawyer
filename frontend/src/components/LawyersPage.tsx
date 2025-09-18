import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import Footer from "./Footer";
import { 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Calendar,
  Filter,
  DollarSign,
  Languages,
  Scale,
  Award,
  Clock,
  CheckCircle,
  Shield,
  TrendingUp
} from "lucide-react";

interface LawyersPageProps {
  onLawyerChat?: (lawyer: {
    name: string;
    image?: string;
    specialization?: string;
    responseTime?: string;
  }) => void;
  onLawyerBooking?: (lawyer: {
    name: string;
    image?: string;
    specialization?: string;
    responseTime?: string;
  }) => void;
}

export default function LawyersPage({ onLawyerChat, onLawyerBooking }: LawyersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState<string>("");

  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: "Corporate Law",
      rating: 4.9,
      reviews: 127,
      location: "Mumbai, IN",
      image: "https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBidXNpbmVzc3xlbnwxfHx8fDE3NTYzMDkzMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Free Consultation",
      languages: ["English", "Hindi"],
      experience: "15 years",
      verified: true,
      responseTime: "2 hours",
      successRate: "95%",
      expertise: ["Mergers & Acquisitions", "Contract Law", "Compliance"]
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      specialization: "Family Law",
      rating: 4.8,
      reviews: 93,
      location: "Delhi, IN",
      image: "https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2MjE4MzI2fDA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "₹500/consultation",
      languages: ["English", "Hindi", "Punjabi"],
      experience: "12 years",
      verified: true,
      responseTime: "1 hour",
      successRate: "92%",
      expertise: ["Divorce", "Child Custody", "Property Division"]
    },
    {
      id: 3,
      name: "Priya Sharma",
      specialization: "Criminal Law",
      rating: 4.9,
      reviews: 156,
      location: "Bangalore, IN",
      image: "https://images.unsplash.com/photo-1562577308-c8b2614b9b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMHByb2Zlc3Npb25hbHN8ZW58MXx8fHwxNzU2MzA5MzAxfDA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Free Consultation",
      languages: ["English", "Hindi", "Kannada"],
      experience: "10 years",
      verified: true,
      responseTime: "30 mins",
      successRate: "97%",
      expertise: ["White Collar Crime", "Bail Matters", "Appeals"]
    },
    {
      id: 4,
      name: "Amit Patel",
      specialization: "Property Law",
      rating: 4.7,
      reviews: 84,
      location: "Ahmedabad, IN",
      image: "https://images.unsplash.com/photo-1564846824194-346b7871b855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50cyUyMGNvbnRyYWN0fGVufDF8fHx8MTc1NjI3ODUxMHww&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "₹800/consultation",
      languages: ["English", "Hindi", "Gujarati"],
      experience: "18 years",
      verified: true,
      responseTime: "3 hours",
      successRate: "90%",
      expertise: ["Real Estate", "Land Disputes", "Property Registration"]
    },
    {
      id: 5,
      name: "Meera Gupta",
      specialization: "Intellectual Property",
      rating: 4.8,
      reviews: 112,
      location: "Pune, IN",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGxhd3llcnxlbnwxfHx8fDE3NTYzMDkzMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "₹1000/consultation",
      languages: ["English", "Hindi", "Marathi"],
      experience: "14 years",
      verified: true,
      responseTime: "1 hour",
      successRate: "94%",
      expertise: ["Patents", "Trademarks", "Copyright"]
    },
    {
      id: 6,
      name: "Vikram Singh",
      specialization: "Employment Law",
      rating: 4.6,
      reviews: 78,
      location: "Chennai, IN",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBsYXd5ZXJ8ZW58MXx8fHwxNzU2MzA5MzAwfDA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "₹600/consultation",
      languages: ["English", "Hindi", "Tamil"],
      experience: "11 years",
      verified: true,
      responseTime: "2 hours",
      successRate: "89%",
      expertise: ["Labour Disputes", "Wrongful Termination", "Workplace Harassment"]
    }
  ];

  const locations = ["all", "Mumbai, IN", "Delhi, IN", "Bangalore, IN", "Ahmedabad, IN", "Pune, IN", "Chennai, IN"];
  const areas = ["all", "Corporate", "Family", "Criminal", "Property", "Intellectual Property", "Employment"];
  const pricingOptions = ["all", "Free Consultation", "Paid"];

  const handleContactLawyer = (lawyer: any) => {
    if (onLawyerChat) {
      onLawyerChat({
        name: lawyer.name,
        image: lawyer.image,
        specialization: lawyer.specialization,
        responseTime: lawyer.responseTime
      });
    }
  };

  const handleBookLawyer = (lawyer: any) => {
    if (onLawyerBooking) {
      onLawyerBooking({
        name: lawyer.name,
        image: lawyer.image,
        specialization: lawyer.specialization,
        responseTime: lawyer.responseTime
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] relative">
      {/* Subtle gold accent background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#77DDE7]/20 text-[#36454F] px-4 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Verified Legal Professionals</span>
          </div>
          <h1 className="text-[#36454F] mb-4">Find Your Legal Expert</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with verified, experienced lawyers who specialize in your area of need. Get trusted legal advice from professionals you can rely on.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-[#77DDE7]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-[#36454F]" />
            </div>
            <p className="text-sm text-[#36454F]">500+ Verified Lawyers</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-[#AEC6CF]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-[#36454F]" />
            </div>
            <p className="text-sm text-[#36454F]">4.8+ Average Rating</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-[#F5E6CC]/50 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-[#36454F]" />
            </div>
            <p className="text-sm text-[#36454F]">Quick Response Time</p>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5 text-[#36454F]" />
            </div>
            <p className="text-sm text-[#36454F]">90%+ Success Rate</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Find the right lawyer for you..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-white text-[#36454F] focus:border-[#AEC6CF] shadow-sm"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-[#AEC6CF]" />
                  <h3 className="text-[#36454F]">Filters</h3>
                </div>

                <div className="space-y-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-[#36454F] mb-3">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#AEC6CF] shadow-sm"
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Area of Law Filter */}
                  <div>
                    <label className="block text-[#36454F] mb-3">
                      <Scale className="w-4 h-4 inline mr-1" />
                      Area of Law
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#AEC6CF] shadow-sm"
                    >
                      {areas.map((area) => (
                        <option key={area} value={area}>
                          {area === "all" ? "All Areas" : `${area} Law`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing Filter */}
                  <div>
                    <label className="block text-[#36454F] mb-3">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Pricing
                    </label>
                    <select
                      value={selectedPricing}
                      onChange={(e) => setSelectedPricing(e.target.value)}
                      className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#AEC6CF] shadow-sm"
                    >
                      {pricingOptions.map((pricing) => (
                        <option key={pricing} value={pricing}>
                          {pricing === "all" ? "All Pricing" : pricing}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-[#36454F] mb-3">
                      <Languages className="w-4 h-4 inline mr-1" />
                      Language
                    </label>
                    <select className="w-full p-3 border border-gray-200 bg-white text-[#36454F] rounded-xl focus:border-[#AEC6CF] shadow-sm">
                      <option value="all">All Languages</option>
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="mandarin">Mandarin</option>
                      <option value="portuguese">Portuguese</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lawyers Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-6">
              {lawyers.map((lawyer) => (
                <Card key={lawyer.id} className="rounded-xl shadow-sm border-gray-100 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  {/* Verification Badge */}
                  {lawyer.verified && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#AEC6CF]/20">
                        <ImageWithFallback
                          src={lawyer.image}
                          alt={lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-[#36454F]">{lawyer.name}</h4>
                          {lawyer.verified && (
                            <Award className="w-4 h-4 text-[#D4AF37]" />
                          )}
                        </div>
                        <p className="text-[#AEC6CF] mb-3">{lawyer.specialization}</p>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-[#36454F]">{lawyer.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({lawyer.reviews} reviews)</span>
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            {lawyer.successRate} success
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {lawyer.location}
                        </div>
                      </div>
                    </div>

                    {/* Expertise Areas */}
                    <div className="mb-4">
                      <p className="text-sm text-[#36454F] mb-2">Expertise:</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.expertise.slice(0, 2).map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs bg-[#AEC6CF]/20 text-[#36454F] border-[#AEC6CF]/30">
                            {area}
                          </Badge>
                        ))}
                        {lawyer.expertise.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{lawyer.expertise.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-center">
                        <div className="text-sm text-[#36454F]">{lawyer.experience}</div>
                        <div className="text-xs text-gray-500">Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-[#36454F]">{lawyer.responseTime}</div>
                        <div className="text-xs text-gray-500">Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-[#36454F]">{lawyer.pricing.includes('₹') ? lawyer.pricing.split('/')[0] : lawyer.pricing}</div>
                        <div className="text-xs text-gray-500">Pricing</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs border-gray-200 text-gray-600">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleContactLawyer(lawyer)}
                        className="flex-1 bg-[#77DDE7] hover:bg-[#77DDE7]/80 rounded-xl text-[#36454F] shadow-sm"
                        style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleBookLawyer(lawyer)}
                        variant="outline" 
                        className="flex-1 border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 rounded-xl"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline" className="border-[#AEC6CF] text-[#36454F] hover:bg-[#AEC6CF]/10 px-8 py-3 rounded-xl shadow-sm">
                Load More Lawyers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}