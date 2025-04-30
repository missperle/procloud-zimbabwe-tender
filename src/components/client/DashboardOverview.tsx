
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, DollarSign, Award } from "lucide-react";

// Mock data - in a real app this would come from API/database
const stats = [
  { 
    title: "Open Briefs", 
    value: "5", 
    change: "+2 from last week",
    icon: <Activity className="h-6 w-6 text-indigo-ink" /> 
  },
  { 
    title: "Proposals Received", 
    value: "28", 
    change: "+10 from last week",
    icon: <Users className="h-6 w-6 text-indigo-ink" /> 
  },
  { 
    title: "Outstanding Payments", 
    value: "$1,200", 
    change: "3 payments pending",
    icon: <DollarSign className="h-6 w-6 text-indigo-ink" /> 
  },
  { 
    title: "Top Freelancer", 
    value: "Sarah Wong", 
    change: "4.9/5 rating",
    icon: <Award className="h-6 w-6 text-indigo-ink" /> 
  },
];

// Mock activity data
const activities = [
  { id: 1, message: "3 new proposals on 'Logo Design'", time: "10 minutes ago" },
  { id: 2, message: "Payment of $200 released to Techexplorer", time: "2 hours ago" },
  { id: 3, message: "Brief 'E-commerce Website Redesign' deadline approaching", time: "5 hours ago" },
  { id: 4, message: "New message from David Miller about the UX/UI project", time: "Yesterday" },
  { id: 5, message: "Brief 'Mobile App Development' has been viewed 25 times", time: "2 days ago" },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mt-8">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <p className="text-sm">{activity.message}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
