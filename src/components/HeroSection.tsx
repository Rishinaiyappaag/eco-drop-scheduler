
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Calendar, MapPin, Award } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 pt-16 pb-20 sm:py-24 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Recycle E-Waste</span>
                <span className="block text-primary">The Smart Way</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                Schedule pickups, find drop-off locations, and earn rewards for recycling your 
                electronic waste responsibly. Join us in creating a greener future.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/schedule">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md">
                      Schedule Pickup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/drop-off">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md">
                      Find Drop-off
                      <MapPin className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative">
              <div className="aspect-w-5 aspect-h-3 rounded-lg shadow-lg overflow-hidden animate-float">
                <img
                  className="object-cover"
                  src="https://images.unsplash.com/photo-1567177662154-dfeb4c93b6ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="E-waste recycling"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Feature boxes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Easy Scheduling</h3>
            <p className="mt-2 text-sm text-gray-600">
              Book a pickup at your convenience with our simple scheduling system.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Drop-off Locator</h3>
            <p className="mt-2 text-sm text-gray-600">
              Find the nearest certified e-waste recycling centers on our interactive map.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="rounded-full bg-primary-50 w-12 h-12 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Reward Program</h3>
            <p className="mt-2 text-sm text-gray-600">
              Earn points for every recycling activity and redeem them for eco-friendly rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
