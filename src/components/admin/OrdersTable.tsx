
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
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Award,
  CheckCircle
} from "lucide-react";

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
  phone: string;
  address: string;
  description: string;
  pointsAwarded: number;
}

type OrderStatus = "pending" | "completed" | "cancelled" | "accepted";

interface OrdersTableProps {
  orders: Order[];
  filteredOrders: Order[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  acceptOrderAndAwardPoints: (orderId: string) => void;
}

const OrdersTable = ({ 
  orders, 
  filteredOrders, 
  searchTerm, 
  setSearchTerm, 
  updateOrderStatus, 
  acceptOrderAndAwardPoints 
}: OrdersTableProps) => {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-800";
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
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
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell>
                      <div className="text-sm">{order.phone}</div>
                      <div className="text-xs text-gray-500 max-w-xs truncate">{order.address}</div>
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
                        {formatStatus(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {order.status === "pending" && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => acceptOrderAndAwardPoints(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Award className="h-3 w-3 mr-1" />
                              Accept & Award
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              className="text-red-500 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === "accepted" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                            <span className="text-sm text-green-600 py-1 px-2 flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              {order.pointsAwarded} pts awarded
                            </span>
                          </>
                        )}
                        {(order.status === "completed" || order.status === "cancelled") && (
                          <span className="text-sm text-gray-500 py-1 px-2">
                            {order.status === "completed" ? "Order completed" : "Order cancelled"}
                          </span>
                        )}
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
  );
};

export default OrdersTable;
