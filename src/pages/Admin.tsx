
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  RefreshCw, 
  Activity, 
  ShoppingCart,
  ChartBar,
  ChartPie,
  Gift,
  Users,
  Trash2,
  Edit,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";
import RewardsManager from "@/components/admin/RewardsManager";
import UsersManager from "@/components/admin/UsersManager";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Define types for the data
interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: string;
  type: string;
  status: string;
  points: number;
  user_id?: string;
}

interface Stats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalPoints: number;
  pickupOrders: number;
  dropOffOrders: number;
}

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

// Define a proper profile type for type safety
type Profile = Tables<'profiles'>;

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

// Points awarded for different device types
const POINTS_BY_DEVICE_TYPE: Record<string, number> = {
  "Smartphone": 100,
  "Laptop": 200,
  "Desktop": 200,
  "Tablet": 150,
  "Monitor": 100,
  "Printer": 120,
  "TV": 180,
  "Gaming Console": 150,
  "Speaker": 80,
  "Smartwatch": 50,
  "Camera": 100,
  "Router": 70,
  "Other": 50
};

// Default points if device type doesn't match any in our map
const DEFAULT_POINTS = 100;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'rewards' | 'users'>('dashboard');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalPoints: 0,
    pickupOrders: 0,
    dropOffOrders: 0
  });
  const [chartData, setChartData] = useState<ChartData>({
    activityData: [],
    deviceTypeData: []
  });

  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) {
        console.log("No user detected, redirecting to login");
        toast({
          title: "Login Required",
          description: "Please login to access the admin dashboard",
          variant: "destructive" 
        });
        navigate('/login');
        return;
      }

      console.log("User logged in:", user.email);

      try {
        console.log("Checking if user is admin with ID:", user.id);
        
        // Check if the user is in the admins table
        const { data, error } = await supabase
          .from('admins')
          .select('id, email')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin status:", error);
          throw error;
        }
        
        if (data) {
          console.log("User is admin:", data);
          setIsAdmin(true);
          fetchOrders();
          fetchStats();
          fetchChartData();
        } else {
          // Try checking by email as fallback
          const { data: emailCheck, error: emailError } = await supabase
            .from('admins')
            .select('id, email')
            .eq('email', user.email)
            .maybeSingle();
            
          if (emailCheck) {
            console.log("User is admin (by email):", emailCheck);
            // Update admin record with correct ID
            await supabase
              .from('admins')
              .update({ id: user.id })
              .eq('email', user.email);
              
            setIsAdmin(true);
            fetchOrders();
            fetchStats();
            fetchChartData();
          } else {
            console.log("User is not admin, redirecting to home");
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin dashboard.",
              variant: "destructive"
            });
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Admin check failed:", error);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkIfAdmin();
  }, [user, navigate, toast]);

  // Set up real-time updates
  useEffect(() => {
    if (!isAdmin) return;

    // Subscribe to e_waste_requests changes
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'e_waste_requests' }, 
        () => {
          console.log("Received real-time update for e_waste_requests");
          fetchOrders();
          fetchStats();
          fetchChartData();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => {
          console.log("Received real-time update for profiles");
          fetchOrders();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    if (!isAdmin) return;
    
    try {
      // Fetch e-waste requests joined with profiles
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select(`
          id,
          user_id,
          pickup_time,
          created_at,
          waste_type,
          status,
          address,
          phone,
          description,
          profiles(first_name, last_name, email, reward_points)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      if (data) {
        const mappedOrders: Order[] = data.map(order => {
          // Ensure profiles is treated as an object with the expected properties
          const profile = order.profiles as unknown as Profile || { 
            first_name: "Unknown", 
            last_name: "User", 
            email: "No email", 
            reward_points: 0 
          };
          
          return {
            id: order.id,
            user_id: order.user_id,
            customer: profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : "Unknown User",
            email: profile.email || "No email",
            date: new Date(order.created_at).toLocaleDateString(),
            items: order.waste_type || "Unknown",
            type: order.address.includes('Drop-off') ? "Drop-off" : "Pickup",
            status: (order.status as string).charAt(0).toUpperCase() + (order.status as string).slice(1),
            points: profile.reward_points || 0
          };
        });

        console.log("Fetched orders:", mappedOrders);
        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Error in fetchOrders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Calculate and fetch stats
  const fetchStats = async () => {
    if (!isAdmin) return;
    
    try {
      // Fetch all e-waste requests
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select('status, address');

      if (error) throw error;

      const stats = {
        totalOrders: data.length,
        completedOrders: data.filter(order => order.status.toLowerCase() === 'completed').length,
        pendingOrders: data.filter(order => order.status.toLowerCase() === 'pending').length,
        totalPoints: 0, // Will calculate from profiles
        pickupOrders: data.filter(order => !order.address.includes('Drop-off')).length,
        dropOffOrders: data.filter(order => order.address.includes('Drop-off')).length
      };

      // Fetch total reward points
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('reward_points');

      if (!profilesError && profilesData) {
        stats.totalPoints = profilesData.reduce((sum, profile) => sum + (profile.reward_points || 0), 0);
      }

      setStats(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch data for charts
  const fetchChartData = async () => {
    if (!isAdmin) return;

    try {
      // For activity chart - group by month
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select('created_at, address')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data for monthly chart
      const monthlyData = processMonthlyData(data);
      
      // Process data for device types
      const { data: wasteTypeData, error: wasteTypeError } = await supabase
        .from('e_waste_requests')
        .select('waste_type');

      if (wasteTypeError) throw wasteTypeError;

      const deviceTypes = processWasteTypeData(wasteTypeData);

      setChartData({
        activityData: monthlyData,
        deviceTypeData: deviceTypes
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Process monthly data for charts
  const processMonthlyData = (data: any[]) => {
    const months: Record<string, { pickups: number, dropoffs: number }> = {};
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { pickups: 0, dropoffs: 0 };
      }
      
      if (item.address.includes('Drop-off')) {
        months[monthYear].dropoffs += 1;
      } else {
        months[monthYear].pickups += 1;
      }
    });
    
    // Convert to array format for chart
    return Object.keys(months).map(month => ({
      name: month,
      pickups: months[month].pickups,
      dropoffs: months[month].dropoffs
    }));
  };

  // Process waste type data for charts
  const processWasteTypeData = (data: any[]) => {
    const types: Record<string, number> = {};
    
    data.forEach(item => {
      const type = item.waste_type || 'Unknown';
      if (!types[type]) {
        types[type] = 0;
      }
      types[type] += 1;
    });
    
    return Object.keys(types).map(type => ({
      name: type,
      value: types[type]
    }));
  };

  useEffect(() => {
    // Filter orders based on search term
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = orders.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.items.toLowerCase().includes(term) ||
        order.type.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      await Promise.all([
        fetchOrders(),
        fetchStats(),
        fetchChartData()
      ]);
      
      toast({
        title: "Data Refreshed",
        description: "All data has been updated."
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again."
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate points based on waste type
  const calculatePoints = (wasteType: string): number => {
    const type = wasteType.trim();
    return POINTS_BY_DEVICE_TYPE[type] || DEFAULT_POINTS;
  };

  // Update order status and award points if completed
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // First get the order details
      const { data: orderData, error: orderError } = await supabase
        .from('e_waste_requests')
        .select('user_id, waste_type, status')
        .eq('id', orderId)
        .single();
        
      if (orderError) throw orderError;
      
      // Only award points if going from non-completed to completed status
      let pointsAwarded = 0;
      if (newStatus === "Completed" && orderData.status !== "completed") {
        pointsAwarded = calculatePoints(orderData.waste_type);
        
        // Get current user points
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('reward_points')
          .eq('id', orderData.user_id)
          .single();
          
        if (userError) throw userError;
        
        // Update user points
        const newPoints = (userData.reward_points || 0) + pointsAwarded;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ reward_points: newPoints })
          .eq('id', orderData.user_id);
          
        if (updateError) throw updateError;
      }
      
      // Update order status
      const { error } = await supabase
        .from('e_waste_requests')
        .update({ status: newStatus.toLowerCase() })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: "Order Updated",
        description: pointsAwarded > 0 
          ? `Order status changed to ${newStatus}. ${pointsAwarded} points awarded to user.`
          : `Order status changed to ${newStatus}.`,
      });
      
      // The real-time subscription will automatically update the UI
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update order status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4 pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-600">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Access Restricted
              </CardTitle>
              <CardDescription>
                Checking admin privileges...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
              <p className="text-center text-gray-600 mt-4">
                If you are an admin, you will be redirected to the admin dashboard.
                Otherwise, you will be redirected to the home page.
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage recycling orders, users, and track performance</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button 
                onClick={() => setActiveTab('dashboard')}
                variant={activeTab === 'dashboard' ? "default" : "outline"}
              >
                <ChartBar className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={() => setActiveTab('orders')}
                variant={activeTab === 'orders' ? "default" : "outline"}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </Button>
              <Button 
                onClick={() => setActiveTab('rewards')}
                variant={activeTab === 'rewards' ? "default" : "outline"}
              >
                <Gift className="h-4 w-4 mr-2" />
                Rewards
              </Button>
              <Button 
                onClick={() => setActiveTab('users')}
                variant={activeTab === 'users' ? "default" : "outline"}
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
              <Button 
                onClick={handleRefresh}
                variant="outline"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
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
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
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
          )}
          
          {/* Orders Table */}
          {activeTab === 'orders' && (
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <CardTitle>E-Waste Recycling Orders</CardTitle>
                  <div className="relative w-full sm:w-64 mt-4 sm:mt-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>List of e-waste recycling orders</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              <div>{order.customer}</div>
                              <div className="text-sm text-gray-500">{order.email}</div>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>
                              <Badge variant={order.type === "Pickup" ? "default" : "secondary"}>
                                {order.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell>{order.points}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "Completed")}
                                  disabled={order.status === "Completed" || order.status === "Cancelled"}
                                >
                                  Complete
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "Cancelled")}
                                  disabled={order.status === "Cancelled"}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                            {orders.length === 0 ? "No orders found in the database." : "No orders found matching your search."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rewards Management */}
          {activeTab === 'rewards' && (
            <RewardsManager />
          )}

          {/* Users Management */}
          {activeTab === 'users' && (
            <UsersManager />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
