
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TokenUsageData {
  name: string;
  tokens: number;
}

interface TokenUsageChartProps {
  data?: TokenUsageData[];
}

const TokenUsageChart = ({ data }: TokenUsageChartProps) => {
  // Sample data - in a real app this would come from Firestore
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    
    // Default sample data if none provided
    return [
      { name: 'Job Posts', tokens: 60 },
      { name: 'Featured', tokens: 25 },
      { name: 'Boosts', tokens: 15 },
      { name: 'Extensions', tokens: 10 },
      { name: 'Other', tokens: 5 },
    ];
  }, [data]);
  
  // Colors for the bars
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Token Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 15 }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                formatter={(value) => [`${value} tokens`, 'Usage']}
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              />
              <Bar dataKey="tokens" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {chartData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-1.5" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-xs text-gray-600">{entry.name}: {entry.tokens} tokens</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenUsageChart;
