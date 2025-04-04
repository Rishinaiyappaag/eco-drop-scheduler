
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
import { 
  Search, 
  RefreshCw, 
  Activity, 
  ShoppingCart,
  ChartBar,
  ChartPie
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";
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

// Sample orders data for demonstration
const sampleOrders = [
  {
    id: "ECO-1001",
    customer: "Alice Johnson",
    email: "alice@example.com",
    date: "2025-04-01",
    items: "Laptop, Smartphone",
    type: "Pickup",
    status: "Completed",
    points: 150
  },
  {
    id: "ECO-1002",
    customer: "Bob Smith",
    email: "bob@example.com",
    date: "2025-04-02",
    items: "Desktop Computer, Monitor",
    type: "Drop-off",
    status: "Pending",
    points: 200
  },
  {
    id: "ECO-1003",
    customer: "Carol Davis",
    email: "carol@example.com",
    date: "2025-04-03",
    items: "Printer, Scanner",
    type: "Pickup",
    status: "Processing",
    points: 120
  },
  {
    id: "ECO-1004",
    customer: "David Wilson",
    email: "david@example.com",
    date: "2025-03-30",
    items: "Tablet, Headphones",
    type: "Drop-off",
    status: "Completed",
    points: 100
  },
  {
    id: "ECO-1005",
    customer: "Eva Martinez",
    email: "eva@example.com",
    date: "2025-03-29",
    items: "Router, External Hard Drive",
    type: "Pickup",
    status: "Cancelled",
    points: 0
  }
];

// Sample data for charts
const activityData = [
  { name: 'Jan', pickups: 40, dropoffs: 24 },
  { name: 'Feb', pickups: 30, dropoffs: 13 },
  { name: 'Mar', pickups: 20, dropoffs: 38 },
  { name: 'Apr', pickups: 27, dropoffs: 39 },
  { name: 'May', pickups: 18, dropoffs: 48 },
  { name: 'Jun', pickups: 23, dropoffs: 38 },
  { name: 'Jul', pickups: 34, dropoffs: 43 },
];

const deviceTypeData = [
  { name: 'Smartphones', value: 350 },
  { name: 'Laptops', value: 300 },
  { name: 'Tablets', value: 200 },
  { name: 'Desktops', value: 150 },
  { name: 'Printers', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

const Admin = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'dashboard'>('dashboard');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabase();

  // Stats calculation
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === "Completed").length;
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const totalPoints = orders.reduce((sum, order) => sum + order.points, 0);
  
  const pickupOrders = orders.filter(order => order.type === "Pickup").length;
  const dropOffOrders = orders.filter(order => order.type === "Drop-off").length;

  // Check if user is admin (for demo: admin@ecodrop.com)
  useEffect(() => {
    if (!user) {
      console.log("No user detected, redirecting to login");
      navigate('/login');
      return;
    }

    console.log("User logged in:", user.email);

    // This is a simplified admin check for demo purposes
    // In a real app, you would check user roles from Supabase
    if (user.email !== "admin@ecodrop.com") {
      console.log("User is not admin, redirecting to home");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

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

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Order data has been updated."
      });
      setIsRefreshing(false);
    }, 1000);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // Update order status
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    });
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">Manage recycling orders and track performance</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
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
                <p className="text-3xl font-bold">{totalOrders}</p>
                <div className="flex items-center mt-2 text-sm">
                  <Activity className="h-4 w-4 mr-1 text-primary" />
                  <span className="text-gray-600">
                    {pickupOrders} Pickups, {dropOffOrders} Drop-offs
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
                <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(completedOrders / totalOrders) * 100}%` }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending</CardTitle>
                <CardDescription>Awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(pendingOrders / totalOrders) * 100}%` }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Points</CardTitle>
                <CardDescription>Reward points issued</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-600">
                    Avg: {Math.round(totalPoints / totalOrders)} per order
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                  <CardDescription>Pickup vs Drop-off trends</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityData}
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
                </CardContent>
              </Card>
                
              {/* Device Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Types Recycled</CardTitle>
                  <CardDescription>Distribution of recycled electronics</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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
                            <TableCell className="font-medium">{order.id}</TableCell>
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
                            No orders found matching your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
