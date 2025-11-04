
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  RefreshCw, 
  ShoppingCart,
  ChartBar,
  Gift,
  Users,
  AlertTriangle,
  FileDown
} from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";
import RewardsManager from "@/components/admin/RewardsManager";
import UsersManager from "@/components/admin/UsersManager";
import AdminStats from "@/components/admin/AdminStats";
import AdminCharts from "@/components/admin/AdminCharts";
import OrdersTable from "@/components/admin/OrdersTable";
import { useAdminData } from "@/hooks/useAdminData";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'rewards' | 'users'>('dashboard');
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

  // Check if user is admin using user_roles table
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

      try {
        // Check if user has 'admin' role in user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("Admin role confirmed for user:", user.id);
          setIsAdmin(true);
        } else {
          console.log("User does not have admin role");
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin dashboard.",
            variant: "destructive"
          });
          navigate('/');
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

    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'e_waste_requests' }, 
        () => refreshAll()
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => refreshAll()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, refreshAll]);

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
      await refreshAll();
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

  const handleExtractReport = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('e_waste_requests')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reportData = ordersData?.map(order => ({
        'First Name': order.profiles?.first_name || 'N/A',
        'Last Name': order.profiles?.last_name || 'N/A',
        'Email': order.profiles?.email || 'N/A',
        'Phone': order.phone || 'N/A',
        'Address': order.address || 'N/A',
        'Pickup Date': new Date(order.pickup_time).toLocaleDateString(),
        'E-Waste Type': order.waste_type || 'N/A',
        'Description': order.description || 'N/A',
        'Status': order.status || 'N/A',
        'Points Awarded': order.points_awarded || 0,
        'Created At': new Date(order.created_at).toLocaleString(),
      })) || [];

      const worksheet = XLSX.utils.json_to_sheet(reportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pickup Orders');
      
      const fileName = `pickup_orders_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Report Exported",
        description: "Pickup orders report has been downloaded successfully."
      });
    } catch (error) {
      console.error("Error extracting report:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      });
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
                onClick={handleExtractReport}
                variant="outline"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Extract Report
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
          
          <AdminStats stats={stats} />
          
          {activeTab === 'dashboard' && (
            <AdminCharts chartData={chartData} />
          )}
          
          {activeTab === 'orders' && (
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

          {activeTab === 'rewards' && (
            <RewardsManager />
          )}

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
