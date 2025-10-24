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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User, Home, Gift, Settings, LogOut, Edit, Check, Package, Camera, Loader2 } from "lucide-react";
import UserOrders from "@/components/profile/UserOrders";
import { signOut } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define Profile type using Supabase types
type ProfileType = Tables<"profiles">;

// Define profile edit form schema
const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, refreshProfile } = useSupabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Form definition
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: ""
    }
  });

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
          .maybeSingle(); // Changed from single() to maybeSingle()
        
        if (error) {
          console.error("Error from Supabase:", error);
          throw error;
        }
        
        console.log("Profile data received:", data);
        
        // If profile doesn't exist, create one
        if (!data) {
          console.log("No profile found, creating a new one");
          const firstName = user.user_metadata?.first_name || '';
          const lastName = user.user_metadata?.last_name || '';
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              email: user.email || '',
              reward_points: 0
            })
            .select()
            .maybeSingle();
          
          if (createError) {
            console.error("Failed to create profile:", createError);
            throw createError;
          }
          
          setProfile(newProfile);
          // Set form default values
          form.reset({
            first_name: newProfile?.first_name || firstName,
            last_name: newProfile?.last_name || lastName,
            email: newProfile?.email || user.email || '',
            phone: newProfile?.phone || '',
            address: newProfile?.address || ''
          });
        } else {
          setProfile(data);
          // Set form default values
          form.reset({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || ""
          });
        }
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
  }, [user, toast, form]);

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
  
  const onSubmitProfileEdit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phone || null,
          address: values.address || null,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Changed from single() to maybeSingle()
      
      if (fetchError) throw fetchError;
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Also refresh the profile in the context
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUploadingAvatar(true);
      
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }
      
      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Refresh profile
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      setProfile(updatedProfile);
      await refreshProfile();
      
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
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
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage 
                      src={profile?.avatar_url || "/placeholder.svg"} 
                      alt={`${profile?.first_name} ${profile?.last_name}`} 
                    />
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    {uploadingAvatar ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                  />
                </div>
                <CardTitle className="mt-4">{profile?.first_name} {profile?.last_name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {profile?.reward_points || 0} Reward Points
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => navigate('/profile')}>
                    <User size={18} className="text-primary" />
                    <span>Profile</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => navigate('/schedule')}>
                    <Home size={18} className="text-primary" />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => navigate('/profile?tab=orders')}>
                    <Package size={18} className="text-primary" />
                    <span>Orders</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => navigate('/rewards')}>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="coupons">Coupons</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitProfileEdit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">
                              <Check size={16} className="mr-1" />
                              Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
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
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <UserOrders userId={user.id} />
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
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
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
                      <Switch defaultChecked />
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
