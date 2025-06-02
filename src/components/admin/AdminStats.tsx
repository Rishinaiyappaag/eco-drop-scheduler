
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface Stats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalPoints: number;
  pickupOrders: number;
  dropOffOrders: number;
}

interface AdminStatsProps {
  stats: Stats;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Orders</CardTitle>
          <CardDescription>All time</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
          <div className="flex items-center mt-2 text-sm">
            <Activity className="h-4 w-4 mr-1 text-primary" />
            <span className="text-gray-600">
              {stats.pickupOrders} Pickups, {stats.dropOffOrders} Drop-offs
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed</CardTitle>
          <CardDescription>Successfully recycled</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ 
              width: stats.totalOrders > 0 ? `${(stats.completedOrders / stats.totalOrders) * 100}%` : '0%'
            }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Pending</CardTitle>
          <CardDescription>Awaiting processing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ 
              width: stats.totalOrders > 0 ? `${(stats.pendingOrders / stats.totalOrders) * 100}%` : '0%'
            }}></div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Points</CardTitle>
          <CardDescription>Reward points issued</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{stats.totalPoints}</p>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-gray-600">
              Avg: {stats.totalOrders > 0 ? Math.round(stats.totalPoints / stats.totalOrders) : 0} per order
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
