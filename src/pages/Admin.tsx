
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
import { Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";

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

type OrderStatus = "Pending" | "Processing" | "Completed" | "Cancelled";

const Admin = () => {
  const [orders, setOrders] = useState(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabase();

  // Stats calculation
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === "Completed").length;
  const pendingOrders = orders.filter(order => order.status === "Pending").length;
  const totalPoints = orders.reduce((sum, order) => sum + order.points, 0);

  // Check if user is admin (for demo: admin@ecodrop.com)
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // This is a simplified admin check for demo purposes
    // In a real app, you would check user roles from Supabase
    if (user.email !== "admin@ecodrop.com") {
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
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="mt-4 sm:mt-0"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed</CardTitle>
                <CardDescription>Successfully recycled</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending</CardTitle>
                <CardDescription>Awaiting processing</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Points</CardTitle>
                <CardDescription>Reward points issued</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Orders Table */}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
