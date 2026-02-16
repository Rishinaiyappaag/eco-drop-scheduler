import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 Fix default marker icons (Vite issue)
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
    return null;
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow">
      <MapContainer
        center={locations[0]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw Route if multiple stops */}
        {locations.length >= 2 && (
          <Polyline positions={locations} color="green" />
        )}

        {/* Markers */}
        {locations.map((loc, index) => (
          <Marker key={index} position={loc}>
            <Popup>
              Stop {index + 1} <br />
              {loc[0].toFixed(4)}, {loc[1].toFixed(4)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default RouteOptimizerMap;
