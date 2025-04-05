
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Sample drop-off locations data
const dropOffLocations = [
  {
    id: 1,
    name: "EcoTech Recycling Center",
    address: "123 Green Street, Anytown",
    hours: "Mon-Fri: 9am-6pm, Sat: 10am-4pm",
    phone: "(555) 123-4567",
    position: [40.7128, -74.0060] as [number, number] // NYC coordinates
  },
  {
    id: 2,
    name: "Electronics Disposal Facility",
    address: "456 Circuit Avenue, Techville",
    hours: "Mon-Sat: 8am-7pm",
    phone: "(555) 987-6543",
    position: [40.7282, -73.9942] as [number, number]
  },
  {
    id: 3,
    name: "Community Recycling Hub",
    address: "789 Ecology Road, Greenfield",
    hours: "Tue-Sun: 10am-5pm",
    phone: "(555) 345-6789",
    position: [40.7023, -74.0186] as [number, number]
  },
  {
    id: 4,
    name: "City E-Waste Collection",
    address: "101 Municipal Way, Downtown",
    hours: "Mon-Fri: 9am-5pm",
    phone: "(555) 234-5678",
    position: [40.7112, -73.9865] as [number, number]
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

  const defaultCenter: L.LatLngExpression = [40.7128, -74.0060]; // NYC coordinates
  const defaultZoom = 13;

  return (
    <div className="h-96 rounded-lg overflow-hidden shadow-md">
      <MapContainer 
        center={defaultCenter}
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
