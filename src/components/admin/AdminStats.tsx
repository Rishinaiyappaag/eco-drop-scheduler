import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Leaf, Brain, MapPin } from "lucide-react";
import { motion } from "framer-motion";

/* ================= TYPES ================= */

interface Stats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalPoints: number;
  pickupOrders: number;
  dropOffOrders: number;
}

interface CarbonData {
  total_pickups: number;
  naive_distance_km: number;
  optimized_distance_km: number;
  naive_co2_kg: number;
  optimized_co2_kg: number;
  carbon_saved_kg: number;
}

interface AdminStatsProps {
  stats: Stats;
  predicted?: number;
  carbon?: CarbonData;
  clusterCount?: number;
  clusterCenters?: number[][];
}

/* ================= COMPONENT ================= */

const AdminStats = ({
  stats,
  predicted = 0,
  carbon,
  clusterCount = 0,
  clusterCenters = []
}: AdminStatsProps) => {

  const efficiency =
    stats.totalOrders > 0
      ? Math.round((predicted / stats.totalOrders) * 100)
      : 0;

  const carbonEfficiency =
    carbon && carbon.naive_co2_kg > 0
      ? Math.round((carbon.carbon_saved_kg / carbon.naive_co2_kg) * 100)
      : 0;

  return (
    <div className="space-y-6 mb-8">

      {/* ===================== ROW 1 ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Orders</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <div className="flex items-center mt-2 text-sm">
              <Activity className="h-4 w-4 mr-1 text-primary" />
              {stats.pickupOrders} Pickups, {stats.dropOffOrders} Drop-offs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {stats.completedOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Predicted Demand</CardTitle>
            <CardDescription>Next cycle forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">
              {predicted}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ===================== ROW 2 ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* AI Efficiency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>AI Efficiency</CardTitle>
            <CardDescription>Prediction ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              <p className="text-3xl font-bold text-blue-600">
                {efficiency}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Saved */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Carbon Saved</CardTitle>
            <CardDescription>Route Optimization Impact</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.p
              key={carbon?.carbon_saved_kg}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-green-600"
            >
              {carbon?.carbon_saved_kg?.toFixed(2) ?? 0} kg
            </motion.p>
          </CardContent>
        </Card>

        {/* Carbon Efficiency */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Carbon Efficiency</CardTitle>
            <CardDescription>CO₂ reduction</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              {carbonEfficiency}%
            </p>
          </CardContent>
        </Card>

        {/* 🌍 Pickup Hotspots */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pickup Hotspots</CardTitle>
            <CardDescription>Clustered Demand Zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
              <p className="text-3xl font-bold text-indigo-600">
                {clusterCount}
              </p>
            </div>

            {clusterCenters.length > 0 && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                {clusterCenters.map((c, index) => (
                  <div key={index}>
                    📍 {c[0].toFixed(2)}, {c[1].toFixed(2)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

    </div>
  );
};

export default AdminStats;
