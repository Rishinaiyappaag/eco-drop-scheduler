import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package, CheckCircle, Truck, Recycle, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  waste_type: string;
  status: string;
  address: string;
  phone: string;
  pickup_time: string;
  created_at: string;
  points_awarded: number;
  description: string;
}

interface UserOrdersProps {
  userId: string;
}

const UserOrders = ({ userId }: UserOrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('e_waste_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load your orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: "bg-yellow-500", label: "Order Placed" },
      accepted: { color: "bg-blue-500", label: "Accepted" },
      picked_up: { color: "bg-purple-500", label: "Picked Up" },
      completed: { color: "bg-green-500", label: "Delivered" },
      cancelled: { color: "bg-red-500", label: "Cancelled" }
    };
    
    const statusInfo = variants[status] || { color: "bg-gray-500", label: status };
    return <Badge className={`${statusInfo.color} text-white`}>{statusInfo.label}</Badge>;
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'picked_up', label: 'Order Picked Up', icon: Truck },
      { key: 'completed', label: 'Delivered to Recycle Hub', icon: Recycle }
    ];

    const statusOrder = ['pending', 'accepted', 'picked_up', 'completed'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => {
      const isCompleted = currentIndex >= statusOrder.indexOf(step.key);
      const isCurrent = status === step.key;
      const Icon = step.icon;

      return (
        <div key={step.key} className="flex items-center gap-3">
          <div className={`flex flex-col items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
            <div className={`rounded-full p-3 ${
              isCompleted || isCurrent 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}>
              <Icon size={20} />
            </div>
            <p className={`text-xs mt-2 text-center ${
              isCompleted || isCurrent ? 'text-primary font-medium' : 'text-gray-400'
            }`}>
              {step.label}
            </p>
          </div>
          {index !== steps.length - 1 && (
            <div className={`h-0.5 flex-1 ${
              currentIndex > statusOrder.indexOf(step.key) 
                ? 'bg-primary' 
                : 'bg-gray-200'
            }`} />
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>Track your e-waste collection orders</CardDescription>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center">
            <Package size={48} className="mx-auto text-gray-300" />
            <p className="mt-4 text-gray-500">No orders yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Schedule a pickup to start recycling your e-waste!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Tracking */}
            {order.status !== 'cancelled' && (
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  {getTrackingSteps(order.status)}
                </div>
                {order.status === 'completed' && order.points_awarded > 0 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-green-600 font-medium">
                      {order.points_awarded} reward points earned!
                    </span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Waste Type</h4>
                <p className="text-base mt-1 capitalize">{order.waste_type}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Pickup Time</h4>
                <p className="text-base mt-1 flex items-center gap-1">
                  <Clock size={16} />
                  {new Date(order.pickup_time).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p className="text-base mt-1">{order.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p className="text-base mt-1">{order.phone}</p>
              </div>
              {order.description && (
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-base mt-1">{order.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserOrders;