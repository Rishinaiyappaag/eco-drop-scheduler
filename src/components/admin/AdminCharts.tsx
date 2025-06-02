
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface ChartData {
  activityData: {
    name: string;
    pickups: number;
    dropoffs: number;
  }[];
  deviceTypeData: {
    name: string;
    value: number;
  }[];
}

interface AdminChartsProps {
  chartData: ChartData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminCharts = ({ chartData }: AdminChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Pickup vs Drop-off trends</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {chartData.activityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.activityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pickups" fill="#0088FE" name="Pickups" />
                <Bar dataKey="dropoffs" fill="#00C49F" name="Drop-offs" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No activity data available</p>
            </div>
          )}
        </CardContent>
      </Card>
        
      {/* Device Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Device Types Recycled</CardTitle>
          <CardDescription>Distribution of recycled electronics</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {chartData.deviceTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.deviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">No device type data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCharts;
