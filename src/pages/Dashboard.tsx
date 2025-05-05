
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkline } from "@/components/ui/sparkline";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  PieChart
} from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import Feed from "@/components/explore/Feed";

// Sample data
const statsData = {
  activeProposals: 7,
  pendingReviews: 3,
  totalEarnings: 3250,
  upcomingDeadlines: 2
};

const recentActivity = [
  { id: 1, type: "win", project: "Logo Design", amount: 150, time: "2h ago" },
  { id: 2, type: "new", project: "Web Development", amount: 1200, time: "5h ago" },
  { id: 3, type: "submission", project: "Mobile App UI", amount: 600, time: "1d ago" },
  { id: 4, type: "feedback", project: "Brand Identity", amount: 800, time: "2d ago" },
];

const proposalData = [
  { id: 1, title: "E-commerce Website Redesign", submittedDate: "2023-04-15", status: "Under Review", amount: 1500 },
  { id: 2, title: "Logo Design for Tech Startup", submittedDate: "2023-04-10", status: "Accepted", amount: 250 },
  { id: 3, title: "Mobile App UI/UX Design", submittedDate: "2023-04-05", status: "Completed", amount: 850 },
  { id: 4, title: "Corporate Brand Identity", submittedDate: "2023-03-28", status: "Rejected", amount: 0 },
  { id: 5, title: "Social Media Campaign", submittedDate: "2023-03-20", status: "In Progress", amount: 600 }
];

const earnings = {
  monthly: [1200, 1500, 2100, 1800, 2300, 2100, 2800, 3250, 2900, 3100, 3500, 4000],
  transactions: [
    { id: 1, date: "2023-04-28", project: "Website Redesign", amount: 1500 },
    { id: 2, date: "2023-04-15", project: "Logo Design", amount: 250 },
    { id: 3, date: "2023-03-30", project: "Mobile App UI", amount: 850 },
    { id: 4, date: "2023-03-10", project: "Brand Identity", amount: 650 },
  ]
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeCategory, setActiveCategory] = useState("All");
  const { currentUser } = useAuth();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Accepted": return "text-green-600";
      case "Completed": return "text-blue-600";
      case "Under Review": return "text-amber-600";
      case "In Progress": return "text-purple-600";
      case "Rejected": return "text-red-600";
      default: return "";
    }
  };
  
  return (
    <Layout>
      <div className="w-full min-h-screen p-4 md:p-6">
        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="proposals">My Proposals</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.activeProposals}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.pendingReviews}</div>
                  <p className="text-xs text-muted-foreground">
                    +1 since yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(statsData.totalEarnings)}</div>
                  <div className="h-[40px] w-full pt-2">
                    <Sparkline data={earnings.monthly} color="var(--accent)" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statsData.upcomingDeadlines}</div>
                  <p className="text-xs text-muted-foreground">
                    Next due in 2 days
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map(activity => (
                      <div key={activity.id} className="flex items-center">
                        <div className={`rounded-full p-2 mr-3 ${
                          activity.type === 'win' ? 'bg-green-100 text-green-700' : 
                          activity.type === 'new' ? 'bg-blue-100 text-blue-700' : 
                          activity.type === 'submission' ? 'bg-purple-100 text-purple-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {activity.type === 'win' && <ArrowUpRight className="h-4 w-4" />}
                          {activity.type === 'new' && <FileText className="h-4 w-4" />}
                          {activity.type === 'submission' && <CheckCircle2 className="h-4 w-4" />}
                          {activity.type === 'feedback' && <PieChart className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {activity.type === 'win' && `You won ${activity.project} project`}
                            {activity.type === 'new' && `New ${activity.project} tender posted`}
                            {activity.type === 'submission' && `You submitted ${activity.project}`}
                            {activity.type === 'feedback' && `Client reviewed ${activity.project}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.amount > 0 && (
                          <div className="text-sm font-medium">
                            {formatCurrency(activity.amount)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Profile Views</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold mr-2">342</p>
                      <span className="text-xs text-green-600">+12%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Proposal Acceptance</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold mr-2">68%</p>
                      <span className="text-xs text-green-600">+5%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold mr-2">4.2h</p>
                      <span className="text-xs text-red-600">-0.8h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Explore Tab */}
          <TabsContent value="explore">
            <div className="mb-4">
              <div className="tabs-container overflow-x-auto hide-scrollbar border-b border-gray-200 sticky top-0 bg-white z-30">
                <div className="flex px-4 py-2 space-x-6 min-w-max">
                  {["All", "Design", "Illustration", "Branding", "Photography", 
                    "Web Development", "Mobile Apps", "Animation", "UI/UX", "3D"].map((category) => (
                    <button
                      key={category}
                      className={`tab-item whitespace-nowrap py-2 px-1 text-sm font-medium transition-colors ${
                        activeCategory === category 
                          ? 'border-b-2 border-accent text-accent' 
                          : 'hover:text-accent'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Feed activeCategory={activeCategory} />
          </TabsContent>

          {/* My Proposals Tab */}
          <TabsContent value="proposals">
            <Card>
              <CardHeader>
                <CardTitle>My Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Title</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposalData.map(proposal => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium">{proposal.title}</TableCell>
                        <TableCell>{new Date(proposal.submittedDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={getStatusColor(proposal.status)}>{proposal.status}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {proposal.amount > 0 ? formatCurrency(proposal.amount) : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <button className="text-blue-600 hover:underline text-sm">
                            {proposal.status === "Completed" || proposal.status === "Rejected" ? "View" : "Edit"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <Sparkline data={earnings.monthly} height={200} color="var(--accent)" />
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings (YTD)</p>
                      <p className="text-2xl font-bold">{formatCurrency(earnings.monthly.reduce((a, b) => a + b, 0))}</p>
                    </div>
                    <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors">
                      Withdraw
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.transactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.project}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(transaction.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/42.jpg`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {currentUser?.email ? currentUser.email.split('@')[0] : 'John Doe'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentUser?.email || 'john.doe@example.com'}
                  </p>
                  <div className="flex mb-4 flex-wrap justify-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Web Development</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">UI/UX Design</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Branding</span>
                  </div>
                  <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors w-full">
                    Edit Profile
                  </button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-square relative overflow-hidden rounded-md group">
                        <img 
                          src={`https://images.unsplash.com/photo-${500000000000 + i * 1000000}?w=500&fit=crop`}
                          alt={`Portfolio item ${i}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="px-3 py-1.5 bg-white text-black text-sm rounded-md">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
