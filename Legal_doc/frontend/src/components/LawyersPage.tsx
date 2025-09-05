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
  Scale
} from "lucide-react";

export default function LawyersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedPricing, setSelectedPricing] = useState("all");

  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialization: "Corporate Law",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1528747008803-f9f5cc8f1a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsYXd5ZXIlMjBidXNpbmVzc3xlbnwxfHx8fDE3NTYzMDkzMDB8MA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Free Consultation",
      languages: ["English", "Spanish"],
      experience: "15 years"
    },
    {
      id: 2,
      name: "Michael Chen",
      specialization: "Family Law",
      rating: 4.8,
      reviews: 93,
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2MjE4MzI2fDA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Paid",
      languages: ["English", "Mandarin"],
      experience: "12 years"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      specialization: "Criminal Law",
      rating: 4.9,
      reviews: 156,
      location: "Chicago, IL",
      image: "https://images.unsplash.com/photo-1562577308-c8b2614b9b9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMHByb2Zlc3Npb25hbHN8ZW58MXx8fHwxNzU2MzA5MzAxfDA&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Free Consultation",
      languages: ["English", "Spanish", "Portuguese"],
      experience: "10 years"
    },
    {
      id: 4,
      name: "David Thompson",
      specialization: "Property Law",
      rating: 4.7,
      reviews: 84,
      location: "Austin, TX",
      image: "https://images.unsplash.com/photo-1564846824194-346b7871b855?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50cyUyMGNvbnRyYWN0fGVufDF8fHx8MTc1NjI3ODUxMHww&ixlib=rb-4.1.0&q=80&w=400",
      pricing: "Paid",
      languages: ["English"],
      experience: "18 years"
    }
  ];

  const locations = ["all", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Austin, TX"];
  const areas = ["all", "Corporate", "Family", "Criminal", "Property"];
  const pricingOptions = ["all", "Free Consultation", "Paid"];

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#36454F] mb-4">Find Your Legal Expert</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with qualified lawyers who specialize in your area of need.
          </p>
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
                <Card key={lawyer.id} className="rounded-xl shadow-sm border-gray-100 bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <ImageWithFallback
                          src={lawyer.image}
                          alt={lawyer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#36454F] mb-2">{lawyer.name}</h4>
                        <p className="text-[#AEC6CF] mb-3">{lawyer.specialization}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-[#36454F]">{lawyer.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({lawyer.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {lawyer.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-[#F5E6CC] text-[#36454F] border border-[#F5E6CC]">
                        {lawyer.experience}
                      </Badge>
                      <Badge variant="secondary" className={`border ${
                        lawyer.pricing === "Free Consultation" 
                          ? "bg-[#77DDE7]/20 text-[#36454F] border-[#77DDE7]/50" 
                          : "bg-[#F5E6CC] text-[#36454F] border-[#F5E6CC]"
                      }`}>
                        {lawyer.pricing}
                      </Badge>
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
                        className="flex-1 bg-[#77DDE7] hover:bg-[#77DDE7]/80 rounded-xl text-[#36454F] shadow-sm"
                        style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        size="sm" 
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