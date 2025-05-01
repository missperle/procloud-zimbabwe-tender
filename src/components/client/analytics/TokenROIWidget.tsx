
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

interface TokenROIData {
  month: string;
  projectValue: number;
  tokenCost: number;
}

interface TokenROIWidgetProps {
  data: TokenROIData[];
}

const TokenROIWidget = ({ data }: TokenROIWidgetProps) => {
  // Calculate overall ROI
  const totalProjectValue = data.reduce((sum, item) => sum + item.projectValue, 0);
  const totalTokenCost = data.reduce((sum, item) => sum + item.tokenCost, 0);
  const roi = totalProjectValue > 0 ? ((totalProjectValue - totalTokenCost) / totalTokenCost) * 100 : 0;
  
  const chartConfig = {
    projectValue: {
      label: "Project Value",
      theme: {
        light: "#4F46E5",
        dark: "#818CF8",
      },
    },
    tokenCost: {
      label: "Token Cost",
      theme: {
        light: "#F59E0B",
        dark: "#FBBF24",
      },
    },
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Token ROI</CardTitle>
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>{roi.toFixed(0)}% Return</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="projectValue"
                  name="projectValue"
                  stroke="var(--color-projectValue)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="tokenCost"
                  name="tokenCost"
                  stroke="var(--color-tokenCost)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 flex justify-center">
          <ChartLegendContent
            payload={[
              { dataKey: "projectValue" },
              { dataKey: "tokenCost" },
            ]}
          />
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Total Project Value</p>
            <p className="text-lg font-bold">${totalProjectValue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Total Token Cost</p>
            <p className="text-lg font-bold">${totalTokenCost.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-md">
            <p className="text-xs text-gray-500">Net Return</p>
            <p className="text-lg font-bold">${(totalProjectValue - totalTokenCost).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenROIWidget;
