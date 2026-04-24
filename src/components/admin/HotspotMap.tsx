import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  clusters: [number, number][];
  points?: [number, number][];
  labels?: number[];
}

const CLUSTER_COLORS = ["#ef4444", "#3b82f6", "#22c55e"];
const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946];

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    }
  }, [positions]);
  return null;
}

const HotspotMap = ({ clusters, points = [], labels = [] }: Props) => {
  const center = clusters && clusters.length > 0 ? clusters[0] : DEFAULT_CENTER;
  const allPositions = [...clusters, ...points].filter(Boolean);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow">
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {allPositions.length > 0 && <FitBounds positions={allPositions} />}

        {/* Cluster zone circles */}
        {clusters.map((c, i) => (
          <Circle
            key={`zone-${i}`}
            center={c}
            radius={2500}
            pathOptions={{
              color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
              fillColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <Popup>
              <strong>Cluster {i + 1}</strong><br />
              Center: {c[0].toFixed(4)}, {c[1].toFixed(4)}
            </Popup>
          </Circle>
        ))}

        {/* Individual pickup points colored by cluster */}
        {points.map((pt, i) => {
          const label = labels[i] ?? 0;
          const color = CLUSTER_COLORS[label % CLUSTER_COLORS.length];
          return (
            <CircleMarker
              key={`pt-${i}`}
              center={pt}
              radius={6}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 1 }}
            >
              <Popup>
                Pickup point<br />
                Cluster {label + 1}<br />
                {pt[0].toFixed(4)}, {pt[1].toFixed(4)}
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Cluster center markers */}
        {clusters.map((c, i) => (
          <CircleMarker
            key={`center-${i}`}
            center={c}
            radius={10}
            pathOptions={{
              color: "#fff",
              fillColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
              fillOpacity: 1,
              weight: 2,
            }}
          >
            <Popup>
              <strong>Hotspot {i + 1}</strong><br />
              {c[0].toFixed(4)}, {c[1].toFixed(4)}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HotspotMap;
