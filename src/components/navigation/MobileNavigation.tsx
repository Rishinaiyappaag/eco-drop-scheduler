
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

interface MobileNavigationProps {
  user: any;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  handleSignOut: () => Promise<void>;
}

const MobileNavigation = ({ user, isMenuOpen, toggleMenu, handleSignOut }: MobileNavigationProps) => {
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white shadow-lg rounded-b-lg">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link 
          to="/" 
          className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
          onClick={toggleMenu}
        >
          Home
        </Link>
        
        {user ? (
          // Authenticated mobile navigation
          <>
            <Link 
              to="/schedule" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
              onClick={toggleMenu}
            >
              Schedule Pickup
            </Link>
            <Link 
              to="/drop-off" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
              onClick={toggleMenu}
            >
              Find Drop-offs
            </Link>
            <Link 
              to="/rewards" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
              onClick={toggleMenu}
            >
              Rewards
            </Link>
            <Link 
              to="/learn" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
              onClick={toggleMenu}
            >
              Learn
            </Link>
            <Link 
              to="/profile" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
              onClick={toggleMenu}
            >
              Profile
            </Link>
            <button 
              onClick={handleSignOut}
              className="w-full mt-2 flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
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
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary"
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
