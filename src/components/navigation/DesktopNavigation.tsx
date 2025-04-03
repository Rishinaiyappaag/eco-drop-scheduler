
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface DesktopNavigationProps {
  user: any;
  handleSignOut: () => Promise<void>;
}

const DesktopNavigation = ({ user, handleSignOut }: DesktopNavigationProps) => {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
        Home
      </Link>
      
      {user ? (
        // Authenticated navigation
        <>
          <Link to="/schedule" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Schedule Pickup
          </Link>
          <Link to="/drop-off" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Find Drop-offs
          </Link>
          <Link to="/rewards" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
            Rewards
          </Link>
          <Link to="/learn" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
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
          <Link to="/profile" className="ml-2">
            <Button variant="ghost" className="w-10 h-10 rounded-full p-0 flex items-center justify-center">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </>
      ) : (
        // Unauthenticated navigation
        <>
          <Link to="/learn" className="px-3 py-2 text-gray-700 hover:text-primary transition-colors">
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
