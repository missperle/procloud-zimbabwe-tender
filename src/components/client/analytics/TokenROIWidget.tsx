
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Sector, Cell, Legend } from "recharts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TokenROIWidgetProps {
  data?: {
    month: string;
    projectValue: number;
    tokenCost: number;
  }[];
}

// Mock data for ROI visualization
const roiData = [
  { name: "Direct Revenue", value: 2500 },
  { name: "Time Saved", value: 1500 },
  { name: "Quality Improvement", value: 1000 },
];

const monthlyData = [
  { month: "Jan", tokens: 200, revenue: 1000 },
  { month: "Feb", tokens: 300, revenue: 1500 },
  { month: "Mar", tokens: 400, revenue: 2000 },
  { month: "Apr", tokens: 320, revenue: 1800 },
  { month: "May", tokens: 450, revenue: 2400 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * (Math.PI / 180));
  const cos = Math.cos(-midAngle * (Math.PI / 180));
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Custom Legend rendering
const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span
            className="w-3 h-3 inline-block mr-1 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const TokenROIWidget: React.FC<TokenROIWidgetProps> = ({ data = monthlyData }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Token ROI Analysis</CardTitle>
        <CardDescription>See how your token investments are performing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">ROI Breakdown</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={roiData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {roiData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    content={renderLegend}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Monthly Token Usage vs Revenue</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="tokenCost" fill="#8884d8" name="Tokens Used" />
                  <Bar yAxisId="right" dataKey="projectValue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-md bg-primary/10 p-4">
            <h4 className="font-medium mb-2">Your ROI Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Token Investment:</span>
                <span className="font-medium">$2,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Return:</span>
                <span className="font-medium">$5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROI Ratio:</span>
                <span className="font-medium text-emerald-600">2.0x</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenROIWidget;
