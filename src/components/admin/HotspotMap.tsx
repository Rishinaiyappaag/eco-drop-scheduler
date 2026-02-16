import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  clusters: [number, number][];
}

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946]; // Bangalore

const HotspotMap = ({ clusters }: Props) => {
  const center =
    clusters && clusters.length > 0
      ? clusters[0]
      : DEFAULT_CENTER;

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow bg-white p-2">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clusters &&
          clusters.map((center, index) => (
            <CircleMarker
              key={index}
              center={center}
              radius={18}
              pathOptions={{ color: "purple", fillOpacity: 0.5 }}
            >
              <Popup>
                Hotspot {index + 1} <br />
                {center[0].toFixed(4)}, {center[1].toFixed(4)}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      {(!clusters || clusters.length === 0) && (
        <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm">
          No active pickup hotspots
        </div>
      )}
    </div>
  );
};

export default HotspotMap;
