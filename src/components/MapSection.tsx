
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Sample drop-off locations data for Bengaluru
const dropOffLocations = [
  {
    id: 1,
    name: "Eco Recyclers Hub",
    address: "123 Koramangala Main Road, Bangalore - 560034",
    hours: "Mon-Sat: 9am-6pm",
    phone: "(555) 123-4567",
    position: [12.9352, 77.6245] as [number, number] // Koramangala coordinates
  },
  {
    id: 2,
    name: "Green Electronics Disposal",
    address: "45 Indiranagar Main Road, Bangalore - 560038",
    hours: "Mon-Sun: 10am-8pm",
    phone: "(555) 987-6543",
    position: [12.9784, 77.6408] as [number, number] // Indiranagar coordinates
  },
  {
    id: 3,
    name: "Tech Waste Solutions",
    address: "78 JP Nagar 2nd Phase, Bangalore - 560078",
    hours: "Tue-Sun: 8am-7pm",
    phone: "(555) 345-6789",
    position: [12.9102, 77.5922] as [number, number] // JP Nagar coordinates
  },
  {
    id: 4,
    name: "Bengaluru E-Waste Collection",
    address: "101 MG Road, Bangalore - 560001",
    hours: "Mon-Fri: 9am-5pm",
    phone: "(555) 234-5678",
    position: [12.9757, 77.6011] as [number, number] // MG Road coordinates
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
