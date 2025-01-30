import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { SimulationState } from "../types/simulationTypes";
import { buildSimulationStates } from "../utils/parseLog";


import { Box, Typography, Slider, Paper, Stack, Container, Grid2 } from "@mui/material";

//Convert (x, y) in meters to lat/lng, origin at Imperial College London.

function convertXYToLatLng(x: number, y: number): [number, number] {
  const IMPERIAL_COLLEGE_LAT = 51.4988;
  const IMPERIAL_COLLEGE_LNG = -0.1749;
  const METERS_PER_DEG_LAT = 111_320;
  const METERS_PER_DEG_LNG =
    METERS_PER_DEG_LAT *
    Math.cos(IMPERIAL_COLLEGE_LAT * (Math.PI / 180));

  const newLat = IMPERIAL_COLLEGE_LAT + y / METERS_PER_DEG_LAT;
  const newLng = IMPERIAL_COLLEGE_LNG + x / METERS_PER_DEG_LNG;
  return [newLat, newLng];
}

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface SimulationMapProps {
  logData: string;
}

const SimulationMap: React.FC<SimulationMapProps> = ({ logData }) => {
  const simulationStates: SimulationState[] = useMemo(
    () => buildSimulationStates(logData),
    [logData]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentState = simulationStates[currentIndex] || null;

  // Slider change handler
  const onSliderChange = (_: Event, value: number | number[]) => {
    setCurrentIndex(value as number);
  };

  // Center map on Imperial College
  const center: [number, number] = [51.4988, -0.1749];

  return (

    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centers Stack horizontally
        alignItems: "center", // Centers Stack vertically
        width: "100vw",
        height: "100vh",
      }}
    >
      <Stack
        spacing={4}
        sx={{
          width: "100%", // Ensures it spans the screen width
          maxWidth: 1200, // Prevents it from becoming too wide
          height: "100vh",
          p: 4,
          boxSizing: "border-box",
          alignItems: "center", // Centers everything inside the stack
        }}
      >
        {/* 1) Slider + Event count */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 800, // Restricts width
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Event Log
          </Typography>

          <Slider
            value={currentIndex}
            min={0}
            max={simulationStates.length - 1}
            onChange={onSliderChange}
            sx={{
              width: "100%",
            }}
          />

          <Typography variant="body2" sx={{ mt: 1 }}>
            Event: {currentIndex} / {simulationStates.length - 1}
          </Typography>
        </Box>

        {/* 2) Event Log line */}
        {currentState && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              textAlign: "center",
            }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: 1,
                whiteSpace: "unset",
                overflow: "auto",
                textOverflow: "ellipsis",
              }}
            >
              <Typography variant="body2" fontStyle="italic">
                {currentState.eventLogLine}
              </Typography>
            </Paper>
          </Box>
        )}

        {/* 3) Map container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            flexGrow: 1,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              height: 500,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={center}
              zoom={14}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {currentState &&
                currentState.nodes.map((node) => {
                  const [lat, lng] = convertXYToLatLng(node.x, node.y);
                  return (
                    <Marker key={node.id} position={[lat, lng]}>
                      <Popup minWidth={200}>
                        <div>
                          <strong>ID:</strong> {node.id}
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
                              {Object.entries(node.routingTable).map(
                                ([destId, route]) => (
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
        </Box>
      </Stack>
    </Box>


  );
};

export default SimulationMap;
