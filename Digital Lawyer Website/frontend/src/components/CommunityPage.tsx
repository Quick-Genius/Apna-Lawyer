import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
  Clock
} from "lucide-react";

export default function CommunityPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

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
                  <Button 
                    className="bg-[#77DDE7] hover:bg-[#77DDE7]/80 px-6 py-3 rounded-xl text-[#36454F] shadow-sm"
                    style={{ backgroundColor: '#77DDE7', color: '#36454F' }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
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