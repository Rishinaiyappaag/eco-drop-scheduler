import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  locations: [number, number][];
}

const RouteOptimizerMap = ({ locations }: Props) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-gray-50 rounded-lg border text-gray-500">
        No route data available. Add pickup orders to see the optimized route.
      </div>
    );
  }

  const center = locations[0];

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Optimized route line */}
        <Polyline positions={locations} color="#2563eb" weight={3} dashArray="6 4" />

        {/* Stop markers */}
        {locations.map((loc, index) => (
          <Marker key={index} position={loc}>
            <Popup>
              <strong>Stop {index + 1}</strong><br />
              {loc[0].toFixed(4)}, {loc[1].toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteOptimizerMap;
