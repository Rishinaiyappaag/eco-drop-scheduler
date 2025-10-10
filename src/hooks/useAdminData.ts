
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

// Define types for the data
export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: string;
  type: string;
  status: string;
  points: number;
  user_id?: string;
  phone: string;
  address: string;
  description: string;
  pointsAwarded: number;
}

export interface Stats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalPoints: number;
  pickupOrders: number;
  dropOffOrders: number;
}

export interface ChartData {
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

type Profile = Tables<'profiles'>;
type OrderStatus = "pending" | "completed" | "cancelled" | "accepted";

// Points awarded for different waste types
const POINTS_BY_WASTE_TYPE: Record<string, number> = {
  "computers": 50,
  "phones": 25,
  "tvs": 40,
  "printers": 30,
  "batteries": 10,
  "cables": 5,
  "appliances": 20,
  "other": 15
};

const DEFAULT_POINTS = 15;

export const useAdminData = (isAdmin: boolean) => {
  const [orders, setOrders] = useState<Order[]>([]);
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
  const { toast } = useToast();

  // Calculate points based on waste type
  const calculatePoints = (wasteType: string): number => {
    const type = wasteType.toLowerCase().trim();
    return POINTS_BY_WASTE_TYPE[type] || DEFAULT_POINTS;
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
      
      if (item.address && item.address.includes('Drop-off')) {
        months[monthYear].dropoffs += 1;
      } else {
        months[monthYear].pickups += 1;
      }
    });
    
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

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    if (!isAdmin) return;
    
    try {
      console.log("Fetching orders from database...");
      
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
          points_awarded,
          profiles!left(first_name, last_name, email, reward_points)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      console.log("Raw orders data:", data);

      if (data) {
        const mappedOrders: Order[] = data.map(order => {
          const profile = order.profiles as unknown as Profile;
          
          return {
            id: order.id,
            user_id: order.user_id,
            customer: profile && profile.first_name && profile.last_name 
              ? `${profile.first_name} ${profile.last_name}` 
              : order.user_id ? "Registered User" : "Guest User",
            email: profile?.email || "No email",
            date: new Date(order.created_at).toLocaleDateString(),
            items: order.waste_type || "Unknown",
            type: order.address && order.address.includes('Drop-off') ? "Drop-off" : "Pickup",
            status: order.status || "pending",
            points: profile?.reward_points || 0,
            phone: order.phone || "No phone",
            address: order.address || "No address",
            description: order.description || "No description",
            pointsAwarded: order.points_awarded || 0
          };
        });

        setOrders(mappedOrders);
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
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select('status, address');

      if (error) throw error;

      const stats = {
        totalOrders: data.length,
        completedOrders: data.filter(order => order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'accepted').length,
        pendingOrders: data.filter(order => order.status.toLowerCase() === 'pending').length,
        totalPoints: 0,
        pickupOrders: data.filter(order => !order.address.includes('Drop-off')).length,
        dropOffOrders: data.filter(order => order.address.includes('Drop-off')).length
      };

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
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select('created_at, address')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const monthlyData = processMonthlyData(data);
      
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

  // Update order status WITHOUT awarding points
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('e_waste_requests')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}.`,
      });
      
      await refreshAll();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update order status.",
        variant: "destructive"
      });
    }
  };

  // Accept order and award points
  const acceptOrderAndAwardPoints = async (orderId: string) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('e_waste_requests')
        .select('user_id, waste_type, status, points_awarded')
        .eq('id', orderId)
        .single();
        
      if (orderError) throw orderError;
      
      // Check if points were already awarded
      if (orderData.points_awarded && orderData.points_awarded > 0) {
        toast({
          title: "Already Awarded",
          description: "Points have already been awarded for this order.",
          variant: "destructive"
        });
        return;
      }
      
      let pointsAwarded = 0;
      if (orderData.user_id) {
        pointsAwarded = calculatePoints(orderData.waste_type);
        
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('reward_points')
          .eq('id', orderData.user_id)
          .single();
          
        if (userError) throw userError;
        
        const newPoints = (userData.reward_points || 0) + pointsAwarded;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ reward_points: newPoints })
          .eq('id', orderData.user_id);
          
        if (updateError) throw updateError;
      }
      
      // Update order status to accepted and store points awarded
      const { error } = await supabase
        .from('e_waste_requests')
        .update({ 
          status: 'accepted',
          points_awarded: pointsAwarded 
        })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast({
        title: "Order Accepted",
        description: pointsAwarded > 0 
          ? `Order accepted successfully! ${pointsAwarded} points awarded to user.`
          : `Order accepted successfully!`,
      });
      
      await refreshAll();
    } catch (error: any) {
      console.error("Error accepting order:", error);
      toast({
        title: "Accept Failed",
        description: error.message || "Could not accept order.",
        variant: "destructive"
      });
    }
  };

  const refreshAll = async () => {
    await Promise.all([
      fetchOrders(),
      fetchStats(),
      fetchChartData()
    ]);
  };

  // Auto-fetch data when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      console.log("Admin status confirmed, fetching all data...");
      refreshAll();
    }
  }, [isAdmin]);

  return {
    orders,
    stats,
    chartData,
    updateOrderStatus,
    acceptOrderAndAwardPoints,
    refreshAll
  };
};
