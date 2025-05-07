
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Gift, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MobileNavigationProps {
  user: any;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  handleSignOut: () => Promise<void>;
}

const MobileNavigation = ({ user, isMenuOpen, toggleMenu, handleSignOut }: MobileNavigationProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;
      
      try {
        // First try direct ID match
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data) {
          console.log("User is admin by ID:", user.email);
          setIsAdmin(true);
        } else {
          // Try checking by email as fallback
          const { data: emailCheck, error: emailError } = await supabase
            .from('admins')
            .select('id, email')
            .eq('email', user.email)
            .maybeSingle();
            
          if (emailCheck) {
            console.log("User is admin by email:", emailCheck);
            // Update admin record with correct ID
            await supabase
              .from('admins')
              .update({ id: user.id })
              .eq('email', user.email);
              
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkIfAdmin();
  }, [user]);
  
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-b-lg">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          to="/" 
          className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
          onClick={toggleMenu}
        >
          Home
        </Link>
        
        {user ? (
          // Authenticated mobile navigation
          <>
            <Link 
              to="/schedule" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Schedule Pickup
            </Link>
            <Link 
              to="/drop-off" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Find Drop-offs
            </Link>
            <Link 
              to="/rewards" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Rewards
            </Link>
            <Link 
              to="/learn" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Learn
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Profile
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className="block px-3 py-2 rounded-md text-green-700 dark:text-green-400 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary font-medium"
                onClick={toggleMenu}
              >
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </div>
              </Link>
            )}
            
            <button 
              onClick={handleSignOut}
              className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </>
        ) : (
          // Unauthenticated mobile navigation
          <>
            <Link 
              to="/learn" 
              className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
              onClick={toggleMenu}
            >
              Learn
            </Link>
            <div className="pt-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
            <div className="pt-2">
              <Link to="/register" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Sign Up</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNavigation;
