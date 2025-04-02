
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, X } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/login">
              <Button className="ml-4" variant="default">
                Sign In
              </Button>
            </Link>
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
            <div className="pt-2">
              <Link to="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
