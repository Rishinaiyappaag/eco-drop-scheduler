
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";

// This is a placeholder for the map functionality
// In a real implementation, you would integrate with Google Maps or another mapping API
const MapSection = () => {
  const [zipCode, setZipCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for e-waste drop-off locations near:", zipCode);
    // In a real implementation, this would trigger an API call to find locations
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Find Drop-off Locations
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Locate certified e-waste recycling centers near you.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-primary-50">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center">
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter your ZIP code"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                />
              </div>
              <Button type="submit" className="mt-3 sm:mt-0 sm:ml-3 flex items-center">
                <Search className="h-4 w-4 mr-2" />
                Find Locations
              </Button>
            </form>
          </div>
          
          <div className="h-96 bg-gray-200 relative">
            {/* This div would be replaced with an actual map component */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto" />
                <p className="mt-2 text-gray-600">
                  Interactive map would be displayed here.
                </p>
                <p className="text-sm text-gray-500">
                  (Using Google Maps or similar API integration)
                </p>
              </div>
            </div>
            
            {/* Sample markers that would appear on the map */}
            <div className="absolute top-1/4 left-1/4 bg-primary text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="absolute top-1/3 right-1/3 bg-primary text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 bg-primary text-white rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Why use certified e-waste drop-off centers?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ensures proper handling of hazardous materials
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Complies with local environmental regulations
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Maximizes resource recovery through proper recycling
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-primary mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Data security for devices with sensitive information
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
