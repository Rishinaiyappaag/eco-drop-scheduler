
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Home, Gift, Settings, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";

// Define Profile type using Supabase types
type ProfileType = Tables<"profiles">;

const Profile = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error from Supabase:", error);
          throw error;
        }
        
        console.log("Profile data received:", data);
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Not Authenticated</h1>
            <p className="mt-4 text-gray-600">Please sign in to view your profile.</p>
            <Button className="mt-4" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow container mx-auto p-4 pt-20 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src="/placeholder.svg" alt={`${profile?.first_name} ${profile?.last_name}`} />
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{profile?.first_name} {profile?.last_name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {profile?.reward_points || 0} Reward Points
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/profile')}>
                    <User size={18} className="text-primary" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/schedule')}>
                    <Home size={18} className="text-primary" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/rewards')}>
                    <Gift size={18} className="text-primary" />
                    <span>Coupons & Rewards</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <Settings size={18} className="text-primary" />
                    <span>Settings</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleSignOut}>
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Full Name</h3>
                        <p className="text-lg">{profile.first_name} {profile.last_name}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Email</h3>
                        <p className="text-lg">{profile.email}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Phone</h3>
                        <p className="text-lg">{profile.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-500">Address</h3>
                        <p className="text-lg">{profile.address || 'Not set'}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Edit Profile</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="coupons" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Coupons</CardTitle>
                    <CardDescription>Available coupons and rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile.reward_points < 100 ? (
                      <div className="text-center py-6">
                        <Gift size={48} className="mx-auto text-gray-300" />
                        <p className="mt-4 text-gray-500">No coupons available yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Continue recycling to earn more points and unlock rewards!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">10% Discount</h3>
                            <p className="text-sm text-gray-500">Valid until Dec 31, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Redeem</Button>
                        </div>
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">Free Local Delivery</h3>
                            <p className="text-sm text-gray-500">Valid until Nov 30, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">Redeem</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <div className="w-full">
                      <h3 className="text-sm font-medium mb-2">Progress to next reward</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.min((profile.reward_points % 100) * 100 / 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {100 - (profile.reward_points % 100)} more points needed
                      </p>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Theme</h3>
                        <p className="text-sm text-gray-500">Toggle between light and dark mode</p>
                      </div>
                      <ThemeToggle />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive pickup and reward notifications</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Privacy Settings</h3>
                        <p className="text-sm text-gray-500">Manage your data and privacy preferences</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
