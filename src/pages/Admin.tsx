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
  FileDown,
  MapPin
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
  const [clusterPoints, setClusterPoints] = useState<number[][]>([]);
  const [clusterLabels, setClusterLabels] = useState<number[]>([]);
  const [routeLocations, setRouteLocations] = useState<number[][]>([]);
  const [predictedDemand, setPredictedDemand] = useState(0);
  const [clusterCount, setClusterCount] = useState(0);
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [carbonEfficiency, setCarbonEfficiency] = useState(0);
  const [naiveCo2, setNaiveCo2] = useState(0);
  const [optimizedCo2, setOptimizedCo2] = useState(0);

  const [strategyText, setStrategyText] = useState("");
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [isFixingCoords, setIsFixingCoords] = useState(false);

  const BANGALORE_DEFAULT = { latitude: 12.9716, longitude: 77.5946 };

  const nominatimQuery = async (query: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
    } catch { }
    return null;
  };

  const geocodeAddress = async (address: string) => {
    const lower = address.toLowerCase();
    const hasCity = lower.includes("bangalore") || lower.includes("bengaluru") || lower.includes("karnataka");
    const withCity = hasCity ? address : `${address}, Bangalore, Karnataka, India`;

    let result = await nominatimQuery(withCity);
    if (result) return result;

    const parts = address.split(",").map((p: string) => p.trim()).filter(Boolean);
    if (parts.length > 1 && /^[\d/\-\w]+$/.test(parts[0])) {
      const rest = parts.slice(1).join(", ");
      result = await nominatimQuery(hasCity ? rest : `${rest}, Bangalore, Karnataka, India`);
      if (result) return result;
    }

    const skip = new Set(["india", "karnataka", "bangalore", "bengaluru", ""]);
    for (const part of parts) {
      if (/\d{6}/.test(part)) continue;
      if (skip.has(part.toLowerCase())) continue;
      result = await nominatimQuery(`${part}, Bangalore, Karnataka, India`);
      if (result && !(result.latitude === BANGALORE_DEFAULT.latitude && result.longitude === BANGALORE_DEFAULT.longitude)) return result;
    }

    return BANGALORE_DEFAULT;
  };

  const fixFallbackCoords = async () => {
    setIsFixingCoords(true);
    try {
      const { data: stuckOrders } = await supabase
        .from("e_waste_requests")
        .select("id, address, latitude, longitude")
        .in("status", ["pending", "accepted"]);

      if (!stuckOrders) return;

      const toFix = stuckOrders.filter((o: any) =>
        o.address &&
        (o.latitude === null ||
          (Math.abs(o.latitude - BANGALORE_DEFAULT.latitude) < 0.0001 &&
           Math.abs(o.longitude - BANGALORE_DEFAULT.longitude) < 0.0001))
      );

      let fixed = 0;
      for (const order of toFix) {
        const result = await geocodeAddress(order.address);
        if (result.latitude !== BANGALORE_DEFAULT.latitude || result.longitude !== BANGALORE_DEFAULT.longitude) {
          await supabase
            .from("e_waste_requests")
            .update({ latitude: result.latitude, longitude: result.longitude })
            .eq("id", order.id);
          fixed++;
        }
      }

      toast({
        title: fixed > 0 ? `Fixed ${fixed} order(s)` : "No stuck orders found",
        description: fixed > 0 ? "Refreshing maps..." : "All active orders already have proper coordinates.",
      });

      if (fixed > 0) await refreshAll();
    } catch (e) {
      console.error("fixFallbackCoords error:", e);
    } finally {
      setIsFixingCoords(false);
    }
  };

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

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

  /* ---------------- BACKEND HEALTH CHECK ---------------- */

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/predict`, { signal: AbortSignal.timeout(3000) });
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
  }, []);

  /* ---------------- FETCH AI DATA ---------------- */

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const predictRes = await fetch(`${BACKEND_URL}/predict`);
        if (!predictRes.ok) throw new Error("predict failed");
        const predictData = await predictRes.json();

        setPredictedDemand(predictData.predicted_orders || 0);
        setClusterCount(predictData.cluster_count || 0);
        setClusterCenters(predictData.cluster_centers || []);
        setClusterPoints(predictData.cluster_points || []);
        setClusterLabels(predictData.cluster_labels || []);

        const carbonRes = await fetch(`${BACKEND_URL}/optimize-carbon`);
        if (!carbonRes.ok) throw new Error("carbon failed");
        const carbonData = await carbonRes.json();

        setRouteLocations(carbonData.locations || []);
        setCarbonSaved(carbonData.carbon_saved_kg || 0);
        setCarbonEfficiency(carbonData.carbon_efficiency || 0);
        setNaiveCo2(carbonData.naive_co2_kg || 0);
        setOptimizedCo2(carbonData.optimized_co2_kg || 0);
        setBackendOnline(true);
      } catch (err) {
        console.error("AI Dashboard error:", err);
        setBackendOnline(false);
      }
    };

    fetchAIData();
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

          <h1 className="text-3xl font-bold mb-4">
            Admin Dashboard
          </h1>

          {/* Backend status banner */}
          {backendOnline === false && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span>
                <strong>AI backend offline.</strong> Start it with:{" "}
                <code className="bg-red-100 px-1 rounded">
                  cd src/ml-backend &amp;&amp; venv\Scripts\activate &amp;&amp; uvicorn main:app --reload
                </code>
              </span>
            </div>
          )}
          {backendOnline === true && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              AI backend online
            </div>
          )}

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

            <Button
              onClick={fixFallbackCoords}
              variant="outline"
              disabled={isFixingCoords}
              title="Re-geocode orders stuck at Bangalore city center"
            >
              <MapPin className={`mr-2 h-5 w-5 ${isFixingCoords ? "animate-pulse" : ""}`} />
              {isFixingCoords ? "Fixing..." : "Fix Coords"}
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
                  naive_co2_kg: naiveCo2,
                  optimized_co2_kg: optimizedCo2,
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
      <HotspotMap
        clusters={clusterCenters as [number, number][]}
        points={clusterPoints as [number, number][]}
        labels={clusterLabels}
      />
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
