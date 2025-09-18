import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Scale, 
  Bell, 
  User, 
  Settings,
  LogOut,
  Gavel,
  MessageCircle,
  FileText,
  Calendar,
  Clock,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  MoreHorizontal,
  Star,
  CalendarDays,
  Briefcase,
  UserCheck,
  Home,
  Grid3x3,
  List,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface LawyerDashboardProps {
  userName?: string;
  onLogout?: () => void;
  onNavigateToSignIn?: () => void;
  onNavigateToSignUp?: () => void;
  onNavigateToLawyerRegistration?: () => void;
  onNavigateToHome?: () => void;
}

export default function LawyerDashboard({ 
  userName = "Dr. Smith", 
  onLogout,
  onNavigateToSignIn,
  onNavigateToSignUp,
  onNavigateToLawyerRegistration,
  onNavigateToHome
}: LawyerDashboardProps) {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [calendarView, setCalendarView] = useState("month");
  const [clientView, setClientView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for dashboard widgets
  const todaysTasks = {
    courtHearings: 3,
    clientMeetings: 5,
    documentReviews: 8,
    completed: 12,
    total: 16,
    overdue: 2
  };

  const communications = {
    emailsSent: 24,
    emailsOpened: 18,
    emailsReplied: 15,
    callsScheduled: 8,
    callsCompleted: 6,
    avgCallDuration: "25 min",
    emailTrend: "up",
    callTrend: "down"
  };

  const upcomingTasks = [
    {
      id: 1,
      type: "court",
      title: "Court Hearing – Case #A123",
      client: "Johnson vs. Smith",
      time: "10:00 AM",
      date: "Today",
      status: "urgent",
      icon: Gavel
    },
    {
      id: 2,
      type: "meeting",
      title: "Client Consultation",
      client: "Sarah Wilson",
      time: "2:30 PM",
      date: "Today",
      status: "normal",
      icon: MessageCircle
    },
    {
      id: 3,
      type: "document",
      title: "Contract Review",
      client: "TechCorp Ltd.",
      time: "9:00 AM",
      date: "Tomorrow",
      status: "normal",
      icon: FileText
    },
    {
      id: 4,
      type: "court",
      title: "Settlement Conference",
      client: "Davis Estate",
      time: "11:00 AM",
      date: "Sep 16",
      status: "normal",
      icon: Gavel
    }
  ];

  const engagedClients = [
    {
      id: 1,
      name: "Sarah Wilson",
      initials: "SW",
      emails: 12,
      meetings: 3,
      calls: 5,
      activity: "high",
      lastContact: "2 hours ago",
      cases: 2,
      priority: "High"
    },
    {
      id: 2,
      name: "TechCorp Ltd.",
      initials: "TC",
      emails: 8,
      meetings: 2,
      calls: 3,
      activity: "medium",
      lastContact: "1 day ago",
      cases: 3,
      priority: "Medium"
    },
    {
      id: 3,
      name: "Johnson Family",
      initials: "JF",
      emails: 15,
      meetings: 4,
      calls: 7,
      activity: "high",
      lastContact: "3 hours ago",
      cases: 1,
      priority: "High"
    },
    {
      id: 4,
      name: "Davis Estate",
      initials: "DE",
      emails: 6,
      meetings: 1,
      calls: 2,
      activity: "low",
      lastContact: "3 days ago",
      cases: 1,
      priority: "Low"
    }
  ];

  const cases = [
    {
      id: "A123",
      client: "Johnson vs. Smith",
      opponent: "Smith Industries",
      status: "Active",
      nextHearing: "Sep 15, 2024",
      priority: "High",
      type: "Corporate Law"
    },
    {
      id: "B456",
      client: "Sarah Wilson",
      opponent: "Wilson Corp",
      status: "Pending",
      nextHearing: "Sep 20, 2024",
      priority: "Medium",
      type: "Contract Dispute"
    },
    {
      id: "C789",
      client: "TechCorp Ltd.",
      opponent: "DataSoft Inc.",
      status: "Active",
      nextHearing: "Sep 18, 2024",
      priority: "High",
      type: "IP Litigation"
    },
    {
      id: "D012",
      client: "Davis Estate",
      opponent: "City Planning",
      status: "Closed",
      nextHearing: "Completed",
      priority: "Low",
      type: "Real Estate"
    }
  ];

  const notifications = [
    {
      id: 1,
      type: "task",
      title: "Court hearing in 2 hours",
      message: "Johnson vs. Smith case hearing at 10:00 AM",
      time: "8:00 AM",
      unread: true,
      icon: Gavel
    },
    {
      id: 2,
      type: "client",
      title: "New message from Sarah Wilson",
      message: "Regarding contract review deadline",
      time: "7:30 AM",
      unread: true,
      icon: MessageCircle
    },
    {
      id: 3,
      type: "reminder",
      title: "Document filing due tomorrow",
      message: "Appeal filing for Case #B456",
      time: "Yesterday",
      unread: false,
      icon: FileText
    },
    {
      id: 4,
      type: "system",
      title: "Weekly report ready",
      message: "Your activity summary is available",
      time: "2 days ago",
      unread: false,
      icon: Star
    }
  ];

  const calendarEvents = [
    {
      id: 1,
      title: "Court Hearing - Johnson vs. Smith",
      time: "10:00 AM",
      date: "15",
      type: "court"
    },
    {
      id: 2,
      title: "Client Meeting - Sarah Wilson",
      time: "2:30 PM",
      date: "15",
      type: "meeting"
    },
    {
      id: 3,
      title: "Document Review",
      time: "9:00 AM",
      date: "16",
      type: "document"
    }
  ];

  const upcomingFilings = [
    {
      id: 1,
      title: "File appeal – Case #B456",
      dueDate: "Sep 15",
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Submit affidavit – Case #C789",
      dueDate: "Sep 20",
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Discovery response – Case #D012",
      dueDate: "Sep 22",
      priority: "low",
      completed: true
    },
    {
      id: 4,
      title: "Motion filing – Case #E345",
      dueDate: "Sep 25",
      priority: "medium",
      completed: false
    }
  ];

  const completedFilings = upcomingFilings.filter(f => f.completed).length;
  const totalFilings = upcomingFilings.length;
  const filingProgress = (completedFilings / totalFilings) * 100;
  const completionPercentage = Math.round((todaysTasks.completed / todaysTasks.total) * 100);
  const unreadNotifications = notifications.filter(n => n.unread).length;

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "cases":
        return "Cases";
      case "clients":
        return "Clients";
      case "calendar":
        return "Calendar";
      default:
        return "Dashboard";
    }
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Dashboard Greeting */}
      <div>
        <h2 className="text-2xl font-semibold text-[#36454F] mb-2">
          Hi {userName}, here's your case summary for today
        </h2>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Categories */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#AEC6CF]/20 rounded-lg flex items-center justify-center">
                    <Gavel className="w-4 h-4 text-[#AEC6CF]" />
                  </div>
                  <span className="text-sm font-medium text-[#36454F]">Court Hearings</span>
                </div>
                <Badge variant="secondary" className="bg-[#D4AF37]/20 text-[#D4AF37] border-0">
                  {todaysTasks.courtHearings}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#77DDE7]/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#77DDE7]" />
                  </div>
                  <span className="text-sm font-medium text-[#36454F]">Client Meetings</span>
                </div>
                <Badge variant="secondary" className="bg-[#D4AF37]/20 text-[#D4AF37] border-0">
                  {todaysTasks.clientMeetings}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F8F9FA] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5E6CC]/40 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-medium text-[#36454F]">Document Reviews</span>
                </div>
                <Badge variant="secondary" className="bg-[#D4AF37]/20 text-[#D4AF37] border-0">
                  {todaysTasks.documentReviews}
                </Badge>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center justify-center py-6">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F5E6CC"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#D4AF37"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#36454F]">{completionPercentage}%</span>
                  <span className="text-xs text-gray-600">Complete</span>
                </div>
              </div>
            </div>

            {/* Task Summary */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                {todaysTasks.completed} of {todaysTasks.total} tasks completed
              </p>
              {todaysTasks.overdue > 0 && (
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {todaysTasks.overdue} overdue tasks
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Communications */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#77DDE7] to-[#5BC0CB] rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              Client Communications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Stats */}
            <div>
              <h4 className="font-semibold text-[#36454F] text-sm mb-4">Email Activity</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.emailsSent}</div>
                  <div className="text-xs text-gray-600 mt-1">Sent</div>
                </div>
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.emailsOpened}</div>
                  <div className="text-xs text-gray-600 mt-1">Opened</div>
                </div>
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.emailsReplied}</div>
                  <div className="text-xs text-gray-600 mt-1">Replied</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {communications.emailTrend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs text-gray-600">vs last week</span>
              </div>
            </div>

            {/* Call Stats */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-[#36454F] text-sm mb-4">Call Activity</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.callsScheduled}</div>
                  <div className="text-xs text-gray-600 mt-1">Scheduled</div>
                </div>
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.callsCompleted}</div>
                  <div className="text-xs text-gray-600 mt-1">Completed</div>
                </div>
                <div className="text-center p-3 bg-[#F8F9FA] rounded-xl">
                  <div className="text-xl font-bold text-[#36454F]">{communications.avgCallDuration}</div>
                  <div className="text-xs text-gray-600 mt-1">Avg Duration</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                {communications.callTrend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs text-gray-600">vs last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.slice(0, 4).map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#F8F9FA] transition-all duration-200 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      task.type === 'court' ? 'bg-[#AEC6CF]/20' :
                      task.type === 'meeting' ? 'bg-[#77DDE7]/20' :
                      'bg-[#F5E6CC]/40'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        task.type === 'court' ? 'text-[#AEC6CF]' :
                        task.type === 'meeting' ? 'text-[#77DDE7]' :
                        'text-[#D4AF37]'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-[#36454F] group-hover:text-[#D4AF37] transition-colors">
                          {task.title}
                        </h4>
                        {task.status === 'urgent' && (
                          <Badge variant="destructive" className="text-xs px-2 py-0">Urgent</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{task.client}</p>
                      <p className="text-xs text-gray-500">{task.time} • {task.date}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                );
              })}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
              onClick={() => setCurrentPage("calendar")}
            >
              View all tasks
            </Button>
          </CardContent>
        </Card>

        {/* Most Engaged Clients */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#F5E6CC] to-[#E8D4A0] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              Most Engaged Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagedClients.slice(0, 4).map((client) => (
                <div key={client.id} className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#F8F9FA] transition-all duration-200 group cursor-pointer">
                  <Avatar className="h-12 w-12 border-2 border-[#D4AF37]/20">
                    <AvatarFallback className="bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] text-white font-semibold">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#36454F] mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {client.name}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {client.emails}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {client.meetings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {client.calls}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Last contact: {client.lastContact}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      client.activity === 'high' ? 'bg-green-500' :
                      client.activity === 'medium' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
                    <Badge variant="outline" className="text-xs">
                      {client.cases} case{client.cases !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
              onClick={() => setCurrentPage("clients")}
            >
              View all clients
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Filings/Deadlines */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] to-[#EE5A52] rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              Upcoming Filings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#36454F]">Weekly Progress</span>
                <span className="text-sm text-gray-600">{completedFilings} of {totalFilings}</span>
              </div>
              <div className="w-full bg-[#F5E6CC] rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${filingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Filing List */}
            <div className="space-y-3">
              {upcomingFilings.filter(f => !f.completed).slice(0, 3).map((filing) => (
                <div key={filing.id} className="flex items-center gap-3 p-4 rounded-xl hover:bg-[#F8F9FA] transition-all duration-200 group">
                  <div className={`w-3 h-3 rounded-full ${
                    filing.priority === 'high' ? 'bg-red-500' :
                    filing.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#36454F] mb-1 group-hover:text-[#D4AF37] transition-colors">
                      {filing.title}
                    </h4>
                    <p className="text-xs text-gray-600">Due {filing.dueDate}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      filing.priority === 'high' ? 'border-red-200 text-red-600' :
                      filing.priority === 'medium' ? 'border-yellow-200 text-yellow-600' :
                      'border-green-200 text-green-600'
                    }`}
                  >
                    {filing.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium"
            >
              View all filings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl xl:col-span-3 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#8B5FBF] to-[#6A4C93] rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-[#36454F] text-sm">Today</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Court hearing completed</p>
                      <p className="text-gray-600">Johnson vs. Smith</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Document reviewed</p>
                      <p className="text-gray-600">TechCorp contract</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-[#36454F] text-sm">Yesterday</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Client consultation</p>
                      <p className="text-gray-600">Sarah Wilson</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Settlement negotiation</p>
                      <p className="text-gray-600">Davis Estate</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-[#36454F] text-sm">This Week</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Motion filed</p>
                      <p className="text-gray-600">Case #C789</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <div className="text-xs">
                      <p className="font-medium text-[#36454F]">Discovery completed</p>
                      <p className="text-gray-600">Multiple cases</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCasesContent = () => (
    <div className="space-y-6">
      {/* Cases Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#36454F]">Cases</h2>
          <p className="text-gray-600">Manage and track all your legal cases</p>
        </div>
        <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Case
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search cases by client, ID, or opponent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="bg-white shadow-sm border-0 rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100">
                <TableHead className="font-semibold text-[#36454F] p-6">Case ID</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Client</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Opponent</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Type</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Status</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Priority</TableHead>
                <TableHead className="font-semibold text-[#36454F]">Next Hearing</TableHead>
                <TableHead className="font-semibold text-[#36454F] p-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.filter(case_ => 
                case_.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                case_.opponent.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((case_) => (
                <TableRow key={case_.id} className="border-b border-gray-50 hover:bg-[#F8F9FA] transition-colors">
                  <TableCell className="font-medium text-[#36454F] p-6">#{case_.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[#36454F]">{case_.client}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{case_.opponent}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {case_.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        case_.status === "Active" ? "default" :
                        case_.status === "Pending" ? "outline" :
                        "secondary"
                      }
                      className={`text-xs ${
                        case_.status === "Active" ? "bg-green-100 text-green-700 border-green-200" :
                        case_.status === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                        "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {case_.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        case_.priority === "High" ? "border-red-200 text-red-600" :
                        case_.priority === "Medium" ? "border-yellow-200 text-yellow-600" :
                        "border-green-200 text-green-600"
                      }`}
                    >
                      {case_.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{case_.nextHearing}</TableCell>
                  <TableCell className="p-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Case
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderClientsContent = () => (
    <div className="space-y-6">
      {/* Clients Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#36454F]">Clients</h2>
          <p className="text-gray-600">Manage your client relationships and communications</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={clientView === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setClientView("grid")}
              className={clientView === "grid" ? "bg-white shadow-sm" : ""}
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={clientView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setClientView("list")}
              className={clientView === "list" ? "bg-white shadow-sm" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white shadow-sm border-0 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search clients by name, email, or company..."
                className="pl-10 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="recent">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid/List */}
      {clientView === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engagedClients.map((client) => (
            <Card key={client.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-16 w-16 border-2 border-[#D4AF37]/20">
                    <AvatarFallback className="bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] text-white font-bold text-lg">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      client.priority === "High" ? "border-red-200 text-red-600" :
                      client.priority === "Medium" ? "border-yellow-200 text-yellow-600" :
                      "border-green-200 text-green-600"
                    }`}
                  >
                    {client.priority}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-[#36454F] group-hover:text-[#D4AF37] transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-gray-600">Last contact: {client.lastContact}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-[#F8F9FA] rounded-lg">
                      <div className="font-semibold text-[#36454F]">{client.cases}</div>
                      <div className="text-xs text-gray-600">Cases</div>
                    </div>
                    <div className="p-2 bg-[#F8F9FA] rounded-lg">
                      <div className="font-semibold text-[#36454F]">{client.emails}</div>
                      <div className="text-xs text-gray-600">Emails</div>
                    </div>
                    <div className="p-2 bg-[#F8F9FA] rounded-lg">
                      <div className="font-semibold text-[#36454F]">{client.meetings}</div>
                      <div className="text-xs text-gray-600">Meetings</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        client.activity === 'high' ? 'bg-green-500' :
                        client.activity === 'medium' ? 'bg-yellow-500' :
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-600 capitalize">{client.activity} activity</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:bg-[#D4AF37]/10 p-1 h-auto">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead className="font-semibold text-[#36454F] p-6">Client</TableHead>
                  <TableHead className="font-semibold text-[#36454F]">Priority</TableHead>
                  <TableHead className="font-semibold text-[#36454F]">Cases</TableHead>
                  <TableHead className="font-semibold text-[#36454F]">Last Contact</TableHead>
                  <TableHead className="font-semibold text-[#36454F]">Activity</TableHead>
                  <TableHead className="font-semibold text-[#36454F]">Communication</TableHead>
                  <TableHead className="font-semibold text-[#36454F] p-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagedClients.map((client) => (
                  <TableRow key={client.id} className="border-b border-gray-50 hover:bg-[#F8F9FA] transition-colors">
                    <TableCell className="p-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] text-white font-semibold">
                            {client.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#36454F]">{client.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          client.priority === "High" ? "border-red-200 text-red-600" :
                          client.priority === "Medium" ? "border-yellow-200 text-yellow-600" :
                          "border-green-200 text-green-600"
                        }`}
                      >
                        {client.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{client.cases}</TableCell>
                    <TableCell className="text-gray-600">{client.lastContact}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          client.activity === 'high' ? 'bg-green-500' :
                          client.activity === 'medium' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="text-sm text-gray-600 capitalize">{client.activity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.emails}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {client.meetings}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {client.calls}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="w-4 h-4 mr-2" />
                            Schedule Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCalendarContent = () => (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#36454F]">Calendar</h2>
          <p className="text-gray-600">Manage your schedule and appointments</p>
        </div>
        <div className="flex gap-2">
          <Tabs value={calendarView} onValueChange={setCalendarView}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-3 bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-[#36454F]">
                September 2024
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const date = i - 0 + 1;
                const hasEvent = calendarEvents.some(event => parseInt(event.date) === date);
                const isToday = date === 15;
                
                return (
                  <div
                    key={i}
                    className={`min-h-[100px] p-2 border border-gray-100 rounded-lg hover:bg-[#F8F9FA] transition-colors ${
                      isToday ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30' : ''
                    } ${date > 30 || date < 1 ? 'text-gray-300' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isToday ? 'text-[#D4AF37]' : 'text-[#36454F]'
                    }`}>
                      {date > 0 && date <= 30 ? date : ''}
                    </div>
                    {hasEvent && (
                      <div className="space-y-1">
                        {calendarEvents
                          .filter(event => parseInt(event.date) === date)
                          .map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded text-white truncate ${
                                event.type === 'court' ? 'bg-red-500' :
                                event.type === 'meeting' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}
                            >
                              {event.time} {event.title}
                            </div>
                          ))
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <Card className="bg-white shadow-sm border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#36454F] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      task.type === 'court' ? 'bg-red-100' :
                      task.type === 'meeting' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        task.type === 'court' ? 'text-red-600' :
                        task.type === 'meeting' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#36454F] mb-1 group-hover:text-[#D4AF37] transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">{task.client}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task.time}
                        </Badge>
                        <span className="text-xs text-gray-500">{task.date}</span>
                      </div>
                      {task.status === 'urgent' && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFCFC]">
      {/* Top Navigation Bar */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#AEC6CF] to-[#89CFF0] rounded-xl flex items-center justify-center shadow-md relative">
                <Scale className="w-5 h-5 text-[#36454F] relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 to-transparent rounded-xl"></div>
              </div>
              <div>
                <h1 className="text-[#36454F] text-xl font-semibold">Apna Lawyer</h1>
                <p className="text-xs text-gray-500 -mt-1">Professional Dashboard</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage("dashboard")}
                className={`text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium px-4 py-2 rounded-xl transition-all ${
                  currentPage === "dashboard" ? "text-[#D4AF37] bg-[#D4AF37]/10" : ""
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage("cases")}
                className={`text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium px-4 py-2 rounded-xl transition-all ${
                  currentPage === "cases" ? "text-[#D4AF37] bg-[#D4AF37]/10" : ""
                }`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Cases
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage("clients")}
                className={`text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium px-4 py-2 rounded-xl transition-all ${
                  currentPage === "clients" ? "text-[#D4AF37] bg-[#D4AF37]/10" : ""
                }`}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Clients
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage("calendar")}
                className={`text-gray-600 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 font-medium px-4 py-2 rounded-xl transition-all ${
                  currentPage === "calendar" ? "text-[#D4AF37] bg-[#D4AF37]/10" : ""
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </Button>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-[#D4AF37]/10 p-2 rounded-xl transition-all"
                onClick={handleNotificationClick}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadNotifications}
                  </div>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-[#D4AF37]/10">
                    <Avatar className="h-10 w-10 border-2 border-[#D4AF37]/20">
                      <AvatarFallback className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] text-white font-semibold">
                        {userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-[#36454F] mb-2">
            {getPageTitle()}
          </h1>
        </div>

        {/* Page Content */}
        {currentPage === "dashboard" && renderDashboardContent()}
        {currentPage === "cases" && renderCasesContent()}
        {currentPage === "clients" && renderClientsContent()}
        {currentPage === "calendar" && renderCalendarContent()}
      </div>

      {/* Notifications Panel */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent className="w-96 sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-[#36454F]">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="bg-[#D4AF37] text-white">
                  {unreadNotifications} new
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Unread Notifications */}
            {unreadNotifications > 0 && (
              <div>
                <h3 className="font-semibold text-[#36454F] text-sm mb-3">Unread</h3>
                <div className="space-y-3">
                  {notifications.filter(n => n.unread).map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <div key={notification.id} className="p-4 bg-[#D4AF37]/5 border-l-4 border-[#D4AF37] rounded-r-lg hover:bg-[#D4AF37]/10 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-[#D4AF37]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#36454F] text-sm mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{notification.time}</span>
                              <Button size="sm" variant="ghost" className="text-[#D4AF37] hover:bg-[#D4AF37]/10 h-6 px-2 text-xs">
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Notifications */}
            <div>
              <h3 className="font-semibold text-[#36454F] text-sm mb-3">Recent</h3>
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? 'hidden' : 'border border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#36454F] text-sm mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            <Button size="sm" variant="ghost" className="text-gray-600 hover:bg-gray-100 h-6 px-2 text-xs">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToLawyerRegistration}
          className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Registration
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToHome}
          className="flex items-center gap-2 text-[#36454F] border-gray-300 hover:bg-gray-50"
        >
          Home
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}