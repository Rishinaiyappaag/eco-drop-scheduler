
import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Edit, Trash2, Plus, UserPlus, Activity } from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  reward_points?: number;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  address?: string;
}

interface UserActivity {
  id: string;
  user_id: string;
  description: string;
  waste_type: string;
  status: string;
  created_at: string;
  points: number;
}

const UsersManager = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Dialog states
  const [userActivityDialogOpen, setUserActivityDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const { toast } = useToast();
  
  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // First fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (profilesError) {
        throw profilesError;
      }
      
      setUsers(profiles || []);
      
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        (user.email && user.email.toLowerCase().includes(term)) || 
        (user.first_name && user.first_name.toLowerCase().includes(term)) ||
        (user.last_name && user.last_name.toLowerCase().includes(term)) ||
        (user.address && user.address.toLowerCase().includes(term))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);
  
  // Fetch user activity
  const fetchUserActivity = async (userId: string) => {
    try {
      setActivityLoading(true);
      
      // Fetch recycling requests for the user
      const { data, error } = await supabase
        .from("e_waste_requests")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Transform the data for display
      const activities = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        description: item.description || "No description",
        waste_type: item.waste_type,
        status: item.status,
        created_at: item.created_at,
        points: 0 // We'll calculate this later if needed
      })) || [];
      
      setUserActivity(activities);
      
    } catch (error: any) {
      console.error("Error fetching user activity:", error);
      toast({
        title: "Error",
        description: "Failed to load user activity. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActivityLoading(false);
    }
  };
  
  // Open user activity dialog
  const openUserActivityDialog = (user: User) => {
    setSelectedUser(user);
    setUserActivityDialogOpen(true);
    fetchUserActivity(user.id);
  };
  
  // Handle user deletion
  const openDeleteConfirmation = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      // First delete the user's profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userToDelete.id);
        
      if (profileError) throw profileError;
      
      // Then delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      );
      
      if (authError) throw authError;
      
      toast({
        title: "Success",
        description: "User has been deleted successfully."
      });
      
      // Close dialog and refresh data
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    }
  };
  
  // Format timestamp to readable date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage system users</CardDescription>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all registered users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">{user.address || "N/A"}</TableCell>
                      <TableCell className="text-right font-semibold">{user.reward_points || 0}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openUserActivityDialog(user)}>
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openDeleteConfirmation(user)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      {searchTerm ? "No users match your search." : "No users found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* User Activity Dialog */}
      <Dialog open={userActivityDialogOpen} onOpenChange={setUserActivityDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Activity - {selectedUser?.first_name} {selectedUser?.last_name}</DialogTitle>
            <DialogDescription>
              Recycling history and activity for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-96 mt-4">
            {activityLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : userActivity.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Waste Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{formatDate(activity.created_at)}</TableCell>
                      <TableCell>{activity.waste_type}</TableCell>
                      <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No activity found for this user.
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => setUserActivityDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {userToDelete && (
            <div className="py-4">
              <p className="font-medium">User: {userToDelete.first_name} {userToDelete.last_name}</p>
              <p className="text-sm text-gray-500">Email: {userToDelete.email}</p>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManager;
