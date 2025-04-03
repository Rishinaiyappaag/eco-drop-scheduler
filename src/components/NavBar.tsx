
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useSupabase } from "@/lib/SupabaseProvider";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate('/');
    }
    toggleMenu();
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Recycle className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold text-primary">EcoDrop</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
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
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
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
      )}
    </nav>
  );
};

export default NavBar;
