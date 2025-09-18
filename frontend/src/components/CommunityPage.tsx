import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Footer from "./Footer";
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Bookmark,
  Tractor,
  Building,
  Home,
  GraduationCap,
  Plus,
  TrendingUp,
  Clock,
  Calendar,
  Video,
  User,
  Mail,
  CheckCircle
} from "lucide-react";

export default function CommunityPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showScheduling, setShowScheduling] = useState(false);
  const [schedulingForm, setSchedulingForm] = useState({
    name: "",
    email: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const communityGroups = [
    {
      id: "farmers",
      name: "Farmers' Rights",
      description: "Legal support and resources for agricultural workers and farmers",
      icon: Tractor,
      members: 12500,
      posts: 847,
      color: "from-green-400 to-green-600"
    },
    {
      id: "corporate",
      name: "Corporate & Brands",
      description: "Business law, intellectual property, and corporate governance",
      icon: Building,
      members: 8900,
      posts: 1234,
      color: "from-blue-400 to-blue-600"
    },
    {
      id: "household",
      name: "Household Laws",
      description: "Family law, property rights, and domestic legal matters",
      icon: Home,
      members: 15200,
      posts: 2103,
      color: "from-purple-400 to-purple-600"
    },
    {
      id: "students",
      name: "Student Rights",
      description: "Educational law, student rights, and academic legal issues",
      icon: GraduationCap,
      members: 6700,
      posts: 892,
      color: "from-orange-400 to-orange-600"
    }
  ];

  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Martinez",
        avatar: "SM",
        role: "Legal Expert"
      },
      group: "Farmers' Rights",
      title: "New Water Rights Amendment - What Farmers Need to Know",
      content: "The recent amendment to the Water Rights Act has significant implications for agricultural operations. Here's a breakdown of the key changes and how they might affect your farming business...",
      timestamp: "2 hours ago",
      likes: 45,
      comments: 12,
      trending: true
    },
    {
      id: 2,
      author: {
        name: "Michael Chen",
        avatar: "MC",
        role: "Community Member"
      },
      group: "Corporate & Brands",
      title: "Question: Trademark Protection for Small Businesses",
      content: "I'm starting a small business and want to protect my brand name. What's the most cost-effective way to secure trademark protection? Any experiences to share?",
      timestamp: "4 hours ago",
      likes: 23,
      comments: 18,
      trending: false
    },
    {
      id: 3,
      author: {
        name: "Emily Rodriguez",
        avatar: "ER",
        role: "Lawyer"
      },
      group: "Household Laws",
      title: "Tenant Rights Update: New Regulations for 2024",
      content: "Important updates to tenant protection laws came into effect this month. Here's what both landlords and tenants should know about the new regulations...",
      timestamp: "6 hours ago",
      likes: 67,
      comments: 24,
      trending: true
    }
  ];

  const handleSchedulingFormChange = (field: string, value: string) => {
    setSchedulingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleMeeting = async () => {
    setIsSubmitting(true);
    
    try {
      // Google Apps Script Web App URL (replace with your actual deployment URL)
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
      
      const formData = new FormData();
      formData.append('name', schedulingForm.name);
      formData.append('email', schedulingForm.email);
      formData.append('consultationType', schedulingForm.consultationType);
      formData.append('preferredDate', schedulingForm.preferredDate);
      formData.append('preferredTime', schedulingForm.preferredTime);
      formData.append('description', schedulingForm.description);
      formData.append('timestamp', new Date().toISOString());

      // For demonstration, we'll simulate the API call
      // In production, replace this with actual fetch to Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Required for Google Apps Script
      });

      // Since mode is 'no-cors', we can't read the response
      // Google Apps Script will handle the calendar event creation
      
      // Simulate success for demo
      setTimeout(() => {
        setSubmitSuccess(true);
        setSchedulingForm({
          name: "",
          email: "",
          consultationType: "",
          preferredDate: "",
          preferredTime: "",
          description: ""
        });
        setIsSubmitting(false);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowScheduling(false);
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setIsSubmitting(false);
    }
  };

  if (showScheduling) {
    return (
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button 
            variant="ghost" 
            onClick={() => setShowScheduling(false)}
            className="mb-6 text-[#36454F] hover:bg-gray-50"
          >
            ← Back to Community
          </Button>

          <Card className="rounded-xl shadow-lg border-gray-100 bg-white">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-[#36454F] mb-2">Schedule a Legal Consultation</CardTitle>
              <p className="text-gray-600">
                Connect with our legal experts for personalized guidance on your legal matters.
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-[#36454F] mb-2">Meeting Scheduled Successfully!</h3>
                  <p className="text-gray-600 mb-4">
                    You'll receive a confirmation email with meeting details shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#36454F] mb-2">Full Name</label>
                      <Input
                        placeholder="Enter your full name"
                        value={schedulingForm.name}
                        onChange={(e) => handleSchedulingFormChange('name', e.target.value)}
                        className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[#36454F] mb-2">Email Address</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={schedulingForm.email}
                        onChange={(e) => handleSchedulingFormChange('email', e.target.value)}
                        className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#36454F] mb-2">Consultation Type</label>
                    <Select 
                      value={schedulingForm.consultationType}
                      onValueChange={(value) => handleSchedulingFormChange('consultationType', value)}
                    >
                      <SelectTrigger className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20">
                        <SelectValue placeholder="Select consultation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family-law">Family Law</SelectItem>
                        <SelectItem value="corporate-law">Corporate Law</SelectItem>
                        <SelectItem value="property-law">Property Law</SelectItem>
                        <SelectItem value="criminal-law">Criminal Law</SelectItem>
                        <SelectItem value="immigration-law">Immigration Law</SelectItem>
                        <SelectItem value="employment-law">Employment Law</SelectItem>
                        <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                        <SelectItem value="general-consultation">General Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#36454F] mb-2">Preferred Date</label>
                      <Input
                        type="date"
                        value={schedulingForm.preferredDate}
                        onChange={(e) => handleSchedulingFormChange('preferredDate', e.target.value)}
                        className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-[#36454F] mb-2">Preferred Time</label>
                      <Select 
                        value={schedulingForm.preferredTime}
                        onValueChange={(value) => handleSchedulingFormChange('preferredTime', value)}
                      >
                        <SelectTrigger className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#36454F] mb-2">Brief Description</label>
                    <Textarea
                      placeholder="Please provide a brief description of your legal matter..."
                      value={schedulingForm.description}
                      onChange={(e) => handleSchedulingFormChange('description', e.target.value)}
                      className="bg-white border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 min-h-[100px]"
                    />
                  </div>

                  <div className="bg-[#F5E6CC]/50 rounded-lg p-4">
                    <h4 className="text-[#36454F] mb-2 flex items-center">
                      <Video className="w-4 h-4 mr-2" />
                      Meeting Details
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 30-minute consultation session</li>
                      <li>• Video call via Google Meet</li>
                      <li>• Calendar invite will be sent to your email</li>
                      <li>• Free initial consultation for new clients</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handleScheduleMeeting}
                    disabled={isSubmitting || !schedulingForm.name || !schedulingForm.email || !schedulingForm.consultationType}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white py-3 rounded-xl shadow-lg transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Scheduling Meeting...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedGroup) {
    const group = communityGroups.find(g => g.id === selectedGroup);
    const Icon = group?.icon || Users;
    
    return (
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Group Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedGroup(null)}
              className="mb-4 text-[#36454F] hover:bg-gray-50"
            >
              ← Back to Communities
            </Button>
            
            <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${group?.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-[#36454F] mb-3">{group?.name}</h1>
                    <p className="text-gray-600 mb-4">{group?.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>{group?.members.toLocaleString()} members</span>
                      <span>{group?.posts} posts</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setShowScheduling(true)}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#D4AF37] text-white px-6 py-3 rounded-xl shadow-sm transition-all duration-300"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meet
                    </Button>
                    <Button 
                      className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 px-6 py-3 rounded-xl text-[#36454F] shadow-sm"
                      style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.filter(post => post.group === group?.name).map((post) => (
              <Card key={post.id} className="rounded-xl shadow-sm border-gray-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#AEC6CF] text-[#36454F]">
                        {post.author.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#36454F]">{post.author.name}</span>
                        <Badge variant="secondary" className="text-xs bg-[#F5E6CC] text-[#36454F] border border-[#F5E6CC]">
                          {post.author.role}
                        </Badge>
                        {post.trending && (
                          <Badge className="bg-[#77DDE7]/20 text-[#36454F] text-xs border border-[#77DDE7]/50">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {post.timestamp}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-[#36454F] mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#36454F] hover:bg-gray-50">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#36454F] hover:bg-gray-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#36454F] hover:bg-gray-50">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#36454F] hover:bg-gray-50 ml-auto">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[#36454F] mb-4">Join the Legal Community</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with others, share experiences, and get legal insights from our active community groups.
          </p>
        </div>

        {/* Community Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card 
                key={group.id} 
                className="rounded-xl shadow-sm border-gray-100 bg-white hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setSelectedGroup(group.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${group.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[#36454F] mb-3">{group.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{group.members.toLocaleString()} members</span>
                    <span>{group.posts} posts</span>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full bg-[#77DDE7] hover:bg-[#77DDE7]/80 rounded-xl text-[#36454F] shadow-sm"
                    style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGroup(group.id);
                    }}
                  >
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-[#36454F] mb-6">Recent Community Activity</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {posts.slice(0, 2).map((post) => (
              <Card key={post.id} className="rounded-xl shadow-sm border-gray-100 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                      {post.group}
                    </Badge>
                    {post.trending && (
                      <Badge className="bg-[#77DDE7]/20 text-[#36454F] text-xs border border-[#77DDE7]/50">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-[#36454F] mb-3">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {post.content.substring(0, 120)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="rounded-xl shadow-sm border-gray-100 bg-[#F9FAFB]">
            <CardContent className="p-8 text-[#36454F]">
              <h3 className="mb-4">Ready to Join the Conversation?</h3>
              <p className="text-gray-600 mb-6">
                Get legal insights, share your experiences, and connect with a community that understands your challenges.
              </p>
              <Button 
                size="lg" 
                className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 text-[#36454F] px-8 py-3 rounded-xl shadow-sm"
                style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
              >
                <Users className="w-5 h-5 mr-2" />
                Explore All Communities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}