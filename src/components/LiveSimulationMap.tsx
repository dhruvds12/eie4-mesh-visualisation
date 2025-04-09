import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSimulationState } from "../context/SimulationContext";
import { Box, Paper, Stack, Typography } from "@mui/material";

// Fix default marker icon.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  // popupAnchor: [1, -34],
  // shadowSize: [41, 41]
});


function convertXYToLatLng(x: number, y: number): [number, number] {
  const IMPERIAL_COLLEGE_LAT = 51.4988;
  const IMPERIAL_COLLEGE_LNG = -0.1749;
  const METERS_PER_DEG_LAT = 111320;
  const METERS_PER_DEG_LNG = METERS_PER_DEG_LAT * Math.cos(IMPERIAL_COLLEGE_LAT * (Math.PI / 180));
  const newLat = IMPERIAL_COLLEGE_LAT + y / METERS_PER_DEG_LAT;
  const newLng = IMPERIAL_COLLEGE_LNG + x / METERS_PER_DEG_LNG;
  return [newLat, newLng];
}

const LiveSimulationMap: React.FC = () => {
  const { state } = useSimulationState();
  // Convert the nodes object into an array.
  const nodes = Object.values(state.nodes);
  const center: [number, number] = [51.4988, -0.1749];

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Stack spacing={4} sx={{ width: "100%", maxWidth: 1200, p: 4, alignItems: "center" }}>
        <Typography variant="h6">Live Simulation Map</Typography>
        <Paper elevation={3} sx={{ width: "100%", height: 500, borderRadius: 2, overflow: "hidden" }}>
          <MapContainer center={center} zoom={14} style={{ width: "100%", height: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {nodes.map((node) => {
              // Assumes that node has properties: node_id, x, and y.
              const [lat, lng] = convertXYToLatLng(node.x, node.y);
              const markerIcon = node.virtual ? defaultIcon : redIcon;
              const nodeTypeText = node.virtual ? "Virtual Node" : "Physical Node";

              return (
                <Marker key={node.node_id} position={[lat, lng]} icon={markerIcon}>
                  <Popup>
                    <div>
                      {nodeTypeText}
                      <br />
                      <strong>ID:</strong> {node.node_id}
                      <br />
                      <strong>Routing Table:</strong>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          marginTop: "4px",
                          textAlign: "left",
                        }}
                      >
                        <thead>
                          <tr>
                            <th>Dest</th>
                            <th>Hops</th>
                            <th>Via</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(node.routingTable ?? {}).map(([destId, route]) => (
                            <tr key={destId}>
                              <td>{destId}</td>
                              <td>{route.hops ?? "-"}</td>
                              <td>{route.via ?? "-"}</td>
                            </tr>
                          )
                          )}
                        </tbody>
                      </table>

                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </Paper>
      </Stack>
    </Box>
  );
};

export default LiveSimulationMap;
