import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  ShoppingCart,
  LayoutDashboard,
  Gift,
  Users,
  Map,
  FileDown
} from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";
import RewardsManager from "@/components/admin/RewardsManager";
import UsersManager from "@/components/admin/UsersManager";
import AdminStats from "@/components/admin/AdminStats";
import AdminCharts from "@/components/admin/AdminCharts";
import OrdersTable from "@/components/admin/OrdersTable";
import CarbonTrendChart from "@/components/admin/CarbonTrendChart";
import HotspotMap from "@/components/admin/HotspotMap";
import RouteOptimizerMap from "@/components/admin/RouteOptimizerMap";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";

/* ---------------- TYPES ---------------- */

type TabType =
  | "dashboard"
  | "ai-route"
  | "ai-strategy"
  | "orders"
  | "rewards"
  | "users";

/* ---------------- COMPONENT ---------------- */

const Admin = () => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [clusterCenters, setClusterCenters] = useState<number[][]>([]);
  const [routeLocations, setRouteLocations] = useState<number[][]>([]);
  const [predictedDemand, setPredictedDemand] = useState(0);
  const [clusterCount, setClusterCount] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [carbonEfficiency, setCarbonEfficiency] = useState(0);

  const [strategyText, setStrategyText] = useState("");
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    orders,
    stats,
    chartData,
    updateOrderStatus,
    acceptOrderAndAwardPoints,
    completeOrderAndAwardPoints,
    refreshAll
  } = useAdminData(isAdmin);

  /* ---------------- ADMIN CHECK ---------------- */

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (data) setIsAdmin(true);
      else navigate("/");
    };

    checkAdmin();
  }, [user]);

  /* ---------------- FILTER ORDERS ---------------- */

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredOrders(
        orders.filter((o: any) =>
          o.customer?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, orders]);

  /* ---------------- AI STRATEGY ---------------- */

  const fetchStrategy = async () => {
    try {
      setIsStrategyLoading(true);

      console.log("Calling:", `${BACKEND_URL}/strategy`);

      const res = await fetch(`${BACKEND_URL}/strategy`);

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      console.log("Strategy Response:", data);

      setStrategyText(data.strategy || "No strategy generated.");
    } catch (err) {
      console.error("Strategy fetch failed", err);
      setStrategyText("Failed to generate strategy.");
    } finally {
      setIsStrategyLoading(false);
    }
  };

  /* ---------------- FETCH AI DATA ---------------- */

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const predictRes = await fetch(`${BACKEND_URL}/predict`);
        const predictData = await predictRes.json();

        setPredictedDemand(predictData.predicted_orders || 0);
        setClusterCount(predictData.cluster_count || 0);
        setClusterCenters(predictData.cluster_centers || []);

        const carbonRes = await fetch(`${BACKEND_URL}/optimize-carbon`);
        const carbonData = await carbonRes.json();

        setRouteLocations(carbonData.locations || []);
        setCarbonSaved(carbonData.carbon_saved_kg || 0);
        setCarbonEfficiency(carbonData.carbon_efficiency || 0);

        console.log("AI Data Loaded:", predictData, carbonData);
      } catch (err) {
        console.error("AI Dashboard error:", err);
      }
    };

    if (orders.length > 0) {
      fetchAIData();
    }
  }, [orders]);

  /* ---------------- REFRESH ---------------- */

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setIsRefreshing(false);
  };

  /* ---------------- EXPORT ---------------- */

  const handleExtractReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(orders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders.xlsx");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow pt-20 pb-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">
            Admin Dashboard
          </h1>

          <div className="flex flex-wrap gap-4 mb-8">

            <Button
              onClick={() => setActiveTab("dashboard")}
              variant={activeTab === "dashboard" ? "default" : "outline"}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>

            <Button
              onClick={() => setActiveTab("ai-route")}
              variant={activeTab === "ai-route" ? "default" : "outline"}
            >
              <Map className="mr-2 h-5 w-5" />
              AI Route
            </Button>

            <Button
              onClick={() => {
                setActiveTab("ai-strategy");
                fetchStrategy();
              }}
              variant={activeTab === "ai-strategy" ? "default" : "outline"}
            >
              🧠 AI Strategy
            </Button>

            <Button
              onClick={() => setActiveTab("orders")}
              variant={activeTab === "orders" ? "default" : "outline"}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Orders
            </Button>

            <Button
              onClick={() => setActiveTab("rewards")}
              variant={activeTab === "rewards" ? "default" : "outline"}
            >
              <Gift className="mr-2 h-5 w-5" />
              Rewards
            </Button>

            <Button
              onClick={() => setActiveTab("users")}
              variant={activeTab === "users" ? "default" : "outline"}
            >
              <Users className="mr-2 h-5 w-5" />
              Users
            </Button>

            <Button onClick={handleExtractReport} variant="outline">
              <FileDown className="mr-2 h-5 w-5" />
              Extract Report
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* CONTENT */}

          {activeTab === "dashboard" && (
            <>
              <AdminStats
                stats={stats}
                predicted={predictedDemand}
                carbon={{
                  total_pickups: routeLocations.length,
                  naive_distance_km: 0,
                  optimized_distance_km: 0,
                  naive_co2_kg: 0,
                  optimized_co2_kg: 0,
                  carbon_saved_kg: carbonSaved
                }}
                clusterCount={clusterCount}
                clusterCenters={clusterCenters}
              />
              <AdminCharts chartData={chartData} />
              <CarbonTrendChart carbonSaved={carbonSaved} />
            </>
          )}

          {activeTab === "ai-route" && (
  <div className="space-y-8">

    {/* AI Cluster Map */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        🤖 AI Cluster Analysis
      </h2>
      <HotspotMap clusters={clusterCenters} />
    </div>

    {/* AI Route Optimizer */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        🚛 AI Route Optimizer
      </h2>

      {routeLocations.length >= 2 ? (
        <RouteOptimizerMap
          locations={routeLocations as [number, number][]}
        />
      ) : (
        <div className="text-gray-500">
          Not enough active orders.
        </div>
      )}
    </div>

  </div>
)}


          {activeTab === "ai-strategy" && (
            <div className="bg-white p-6 rounded shadow space-y-4">
              <h2 className="text-xl font-bold">
                AI Strategy Recommendation
              </h2>

              {isStrategyLoading ? (
                <p className="text-gray-500 animate-pulse">
                  Generating intelligent deployment strategy...
                </p>
              ) : (
                <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500 whitespace-pre-line">
                  {strategyText}
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <OrdersTable
              orders={orders}
              filteredOrders={filteredOrders}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              updateOrderStatus={updateOrderStatus}
              acceptOrderAndAwardPoints={acceptOrderAndAwardPoints}
              completeOrderAndAwardPoints={completeOrderAndAwardPoints}
            />
          )}

          {activeTab === "rewards" && <RewardsManager />}
          {activeTab === "users" && <UsersManager />}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
