
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Gift } from "lucide-react";
import { useSupabase } from "@/lib/SupabaseProvider";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Profile } from "@/lib/supabase";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DesktopNavigationProps {
  user: any;
  handleSignOut: () => Promise<void>;
}

const DesktopNavigation = ({ user, handleSignOut }: DesktopNavigationProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching profile:', error.message);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
        Home
      </Link>
      
      {user ? (
        // Authenticated navigation
        <>
          <Link to="/schedule" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
            Schedule Pickup
          </Link>
          <Link to="/drop-off" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
            Find Drop-offs
          </Link>
          <Link to="/rewards" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
            Rewards
          </Link>
          <Link to="/learn" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
            Learn
          </Link>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="ml-4 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-2 w-10 h-10 rounded-full p-0 flex items-center justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 bg-white dark:bg-gray-800" align="end">
              <DropdownMenuLabel>
                <div className="font-semibold">{profile?.first_name} {profile?.last_name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{profile?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = '/profile'} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/rewards'} className="cursor-pointer">
                <Gift className="mr-2 h-4 w-4" />
                <span>Rewards</span>
                {profile?.reward_points ? (
                  <span className="ml-auto bg-primary/10 text-primary text-xs py-0.5 px-2 rounded-full">
                    {profile.reward_points} pts
                  </span>
                ) : null}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = '/profile?tab=settings'} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        // Unauthenticated navigation
        <>
          <Link to="/learn" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors">
            Learn
          </Link>
          <Link to="/login">
            <Button className="ml-4" variant="default">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="ml-2" variant="outline">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default DesktopNavigation;
