
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

// Mock data for line chart (briefs vs proposals)
const lineChartData = [
  { month: "Jan", briefs: 2, proposals: 12 },
  { month: "Feb", briefs: 3, proposals: 19 },
  { month: "Mar", briefs: 1, proposals: 5 },
  { month: "Apr", briefs: 4, proposals: 28 },
  { month: "May", briefs: 3, proposals: 21 },
  { month: "Jun", briefs: 5, proposals: 32 },
];

// Mock data for pie chart (spend by category)
const pieChartData = [
  { name: "Design", value: 2500 },
  { name: "Development", value: 4500 },
  { name: "Writing", value: 1200 },
  { name: "Marketing", value: 800 },
  { name: "Video", value: 1500 },
];

const COLORS = ["#3F51B5", "#FFC107", "#F05A28", "#2196F3", "#9C27B0"];

// Top metrics data
const metrics = [
  { title: "Average Bid Amount", value: "$325" },
  { title: "Average Time to Hire", value: "3.5 days" },
  { title: "Total Briefs Posted", value: "18" },
  { title: "Completion Rate", value: "92%" },
];

const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Briefs vs. Proposals</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="briefs" 
                  stroke="#3F51B5" 
                  strokeWidth={2} 
                  name="Briefs Posted" 
                />
                <Line 
                  type="monotone" 
                  dataKey="proposals" 
                  stroke="#FFC107" 
                  strokeWidth={2} 
                  name="Proposals Received" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-indigo-ink mr-2">•</span>
              <span>Your briefs receive an average of 7.5 proposals each, higher than the platform average of 5.3.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-ink mr-2">•</span>
              <span>Development projects attract the most qualified freelancers based on review scores.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-ink mr-2">•</span>
              <span>Most of your hires are made within 48 hours of posting a brief.</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-ink mr-2">•</span>
              <span>Design projects have been completed 15% faster on average than the platform baseline.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
