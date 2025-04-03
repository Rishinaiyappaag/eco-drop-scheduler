
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSupabase } from "@/lib/SupabaseProvider";
import { signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BrandLogo from "./navigation/BrandLogo";
import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";

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

  // For debugging
  console.log("Current authentication state:", { isLoggedIn: !!user, userId: user?.id });

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <BrandLogo />
          
          {/* Desktop navigation */}
          <DesktopNavigation user={user} handleSignOut={handleSignOut} />
          
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
      <MobileNavigation 
        user={user} 
        isMenuOpen={isMenuOpen} 
        toggleMenu={toggleMenu} 
        handleSignOut={handleSignOut} 
      />
    </nav>
  );
};

export default NavBar;
