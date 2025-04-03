
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { toast } from "@/hooks/use-toast";

// Fix marker icon issues in Leaflet with webpack
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Sample drop-off locations for demonstration
const sampleLocations = [
  { id: 1, name: "EcoTech Recycling Center", address: "123 Green St", lat: 40.7128, lng: -74.006, phone: "555-123-4567" },
  { id: 2, name: "City E-Waste Depot", address: "456 Tech Ave", lat: 40.7282, lng: -73.994, phone: "555-234-5678" },
  { id: 3, name: "GreenDrop Collection Point", address: "789 Recycle Rd", lat: 40.7023, lng: -74.013, phone: "555-345-6789" },
];

const MapSection = () => {
  const [zipCode, setZipCode] = useState("");
  const [locations, setLocations] = useState(sampleLocations);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]); // NYC default
  const [mapZoom, setMapZoom] = useState(12);
  
  // In a real application, this would call an API to search for locations
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for e-waste drop-off locations near:", zipCode);
    // For demo purposes, we'll just pretend we fetched new locations
    toast({
      title: "Locations Updated",
      description: `Found ${locations.length} drop-off locations near ${zipCode}`,
    });
  };

  useEffect(() => {
    // Set default Leaflet icon for all markers
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
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
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations.map((location) => (
                <Marker 
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div>
                      <h3 className="font-medium text-lg">{location.name}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <p className="text-sm text-gray-600">{location.phone}</p>
                      <button 
                        className="mt-2 text-sm text-primary hover:underline"
                        onClick={() => window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank')}
                      >
                        Get Directions
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
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
