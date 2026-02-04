
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Sample drop-off locations data for Bengaluru
const dropOffLocations = [
  {
    id: 1,
    name: "Elxion E-waste Recycling",
    address: "No 24, 23rd A Main Rd, R.K Colony, Marenahalli, 2nd Phase, J. P. Nagar, Bengaluru, Karnataka 560041",
    hours: "Mon-Sat: 9AM-6PM",
    phone: "08026589066",
    website: "http://www.elxion.in/",
    position: [12.9076, 77.5856] as [number, number]
  },
  {
    id: 2,
    name: "Ewaste Hub",
    address: "No 3, Oppo Hombegowda Ground, 10th Cross, Lakkasandra Extension, Wilson Garden, Bengaluru, Karnataka 560027",
    hours: "Mon-Sun: 10AM-8PM",
    phone: "09066319066",
    position: [12.9401, 77.5948] as [number, number]
  },
  {
    id: 3,
    name: "Zolopik",
    address: "58, 22nd Main Rd, Marenahalli, 2nd Phase, J. P. Nagar, Bengaluru, Karnataka 560078",
    hours: "Tue-Sun: 8AM-7PM",
    phone: "09743440440",
    website: "https://www.zolopik.com/",
    position: [12.9051, 77.5869] as [number, number]
  },
  {
    id: 4,
    name: "Ecosphere Waste Solutions",
    address: "Flat No 201, Dhammanagi Zeus Apartment, Millers Tank Bund Rd, Vasanth Nagar, Bengaluru, Karnataka 560051",
    hours: "Mon-Sat: 9AM-6PM",
    phone: "09035489496",
    position: [12.9920, 77.5870] as [number, number]
  }
];

const MapSection = () => {
  const [customIcon, setCustomIcon] = useState<L.Icon | null>(null);

  useEffect(() => {
    // Fix for default marker icons in React Leaflet
    const defaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    L.Marker.prototype.options.icon = defaultIcon;
    setCustomIcon(defaultIcon);
    
    return () => {
      // Cleanup if needed
    };
  }, []);

  if (!customIcon) {
    return <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Center map on Bengaluru
  const bengaluruCenter: L.LatLngExpression = [12.9716, 77.5946]; // Bengaluru city center
  const defaultZoom = 12;

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={bengaluruCenter}
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {dropOffLocations.map((location) => (
          <Marker 
            key={location.id}
            position={location.position}
          >
            <Popup>
              <div>
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <p className="text-gray-700">{location.address}</p>
                <p className="text-gray-600 text-sm mt-2"><span className="font-medium">Hours:</span> {location.hours}</p>
                <p className="text-gray-600 text-sm"><span className="font-medium">Phone:</span> {location.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapSection;
