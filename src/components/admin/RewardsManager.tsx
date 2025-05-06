
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
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, Edit, Trash2, Plus } from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  created_at?: string;
  updated_at?: string;
}

const RewardsManager = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPoints, setFormPoints] = useState<number | string>("");
  
  const { toast } = useToast();
  
  // Fetch rewards from Supabase
  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .order("points", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setRewards(data || []);
      
    } catch (error: any) {
      console.error("Error fetching rewards:", error);
      toast({
        title: "Error",
        description: "Failed to load rewards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchRewards();
  }, []);
  
  // Filter rewards based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRewards(rewards);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = rewards.filter(reward => 
        reward.title.toLowerCase().includes(term) || 
        reward.description.toLowerCase().includes(term)
      );
      setFilteredRewards(filtered);
    }
  }, [searchTerm, rewards]);
  
  // Add new reward
  const handleAddReward = async () => {
    if (!formTitle || !formDescription || !formPoints) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const numPoints = Number(formPoints);
      if (isNaN(numPoints) || numPoints <= 0) {
        toast({
          title: "Invalid Points",
          description: "Points must be a positive number",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await supabase
        .from("rewards")
        .insert({
          title: formTitle,
          description: formDescription,
          points: numPoints
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reward added successfully"
      });
      
      // Reset form and refresh data
      setDialogOpen(false);
      resetForm();
      fetchRewards();
      
    } catch (error: any) {
      console.error("Error adding reward:", error);
      toast({
        title: "Error",
        description: "Failed to add reward. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Update existing reward
  const handleUpdateReward = async () => {
    if (!currentReward || !formTitle || !formDescription || !formPoints) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const numPoints = Number(formPoints);
      if (isNaN(numPoints) || numPoints <= 0) {
        toast({
          title: "Invalid Points",
          description: "Points must be a positive number",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from("rewards")
        .update({
          title: formTitle,
          description: formDescription,
          points: numPoints,
          updated_at: new Date().toISOString()
        })
        .eq("id", currentReward.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reward updated successfully"
      });
      
      // Reset form and refresh data
      setDialogOpen(false);
      resetForm();
      fetchRewards();
      
    } catch (error: any) {
      console.error("Error updating reward:", error);
      toast({
        title: "Error",
        description: "Failed to update reward. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Delete reward
  const handleDeleteReward = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reward?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("rewards")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reward deleted successfully"
      });
      
      // Refresh data
      fetchRewards();
      
    } catch (error: any) {
      console.error("Error deleting reward:", error);
      toast({
        title: "Error",
        description: "Failed to delete reward. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Open dialog to add new reward
  const openAddDialog = () => {
    setDialogMode("add");
    resetForm();
    setDialogOpen(true);
  };
  
  // Open dialog to edit reward
  const openEditDialog = (reward: Reward) => {
    setDialogMode("edit");
    setCurrentReward(reward);
    setFormTitle(reward.title);
    setFormDescription(reward.description);
    setFormPoints(reward.points);
    setDialogOpen(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormPoints("");
    setCurrentReward(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Rewards Management</CardTitle>
              <CardDescription>Create, edit and manage rewards for users</CardDescription>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Search rewards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64"
                />
              </div>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Reward
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of available rewards</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Reward</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRewards.length > 0 ? (
                  filteredRewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <Gift className="h-4 w-4 text-primary" />
                          </div>
                          {reward.title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{reward.description}</TableCell>
                      <TableCell className="text-right font-semibold">{reward.points}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(reward)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteReward(reward.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                      {searchTerm ? "No rewards match your search." : "No rewards found. Add some rewards to get started."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Reward" : "Edit Reward"}</DialogTitle>
            <DialogDescription>
              {dialogMode === "add" 
                ? "Create a new reward for users to earn through recycling activities." 
                : "Update the details of this reward."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter reward title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Enter reward description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                Points Required
              </label>
              <Input
                id="points"
                type="number"
                placeholder="Enter points required"
                min="1"
                value={formPoints}
                onChange={(e) => setFormPoints(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={dialogMode === "add" ? handleAddReward : handleUpdateReward}
            >
              {dialogMode === "add" ? "Add Reward" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RewardsManager;
