import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { SimulationState } from '../types/simulationTypes';
import { buildSimulationStates } from '../utils/parseLog';

interface SimulationMapProps {
  logData: string;
}

/**
 * Convert local X/Y in meters to lat/long, with origin at Imperial College London
 */
function convertXYToLatLng(x: number, y: number): [number, number] {
  // Approx conversion around London area
  const IMPERIAL_COLLEGE_LAT = 51.4988;
  const IMPERIAL_COLLEGE_LNG = -0.1749;
  const METERS_PER_DEG_LAT = 111_320;
  const METERS_PER_DEG_LNG = METERS_PER_DEG_LAT * Math.cos(IMPERIAL_COLLEGE_LAT * (Math.PI / 180));

  const newLat = IMPERIAL_COLLEGE_LAT + y / METERS_PER_DEG_LAT;
  const newLng = IMPERIAL_COLLEGE_LNG + x / METERS_PER_DEG_LNG;
  return [newLat, newLng];
}

/**
 * Fix default marker icon so you see the typical Leaflet marker
 * (otherwise it may appear as a broken image).
 */
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

const SimulationMap: React.FC<SimulationMapProps> = ({ logData }) => {
  // Parse the simulation states once
  const simulationStates: SimulationState[] = useMemo(
    () => buildSimulationStates(logData),
    [logData]
  );

  // Track which event index we’re on
  const [currentIndex, setCurrentIndex] = useState(0);

  // Current state to display
  const currentState = simulationStates[currentIndex] || null;

  // Base map center is Imperial College
  const center: [number, number] = [51.4988, -0.1749];

  // Slider handler
  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(Number(e.target.value));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Slider */}
      <div style={{ padding: '1rem' }}>
        <label>Event: </label>
        <input
          type="range"
          min={0}
          max={simulationStates.length - 1}
          value={currentIndex}
          onChange={onSliderChange}
          style={{ width: '60%' }}
        />
        <span style={{ marginLeft: '1rem' }}>
          {currentIndex}/{simulationStates.length - 1}
        </span>

        {currentState && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
            {currentState.eventLogLine}
          </div>
        )}
      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {currentState &&
            currentState.nodes.map((node) => {
              const [lat, lng] = convertXYToLatLng(node.x, node.y);
              return (
                <Marker key={node.id} position={[lat, lng]}>
                  <Popup>
                    <div>
                      <strong>ID:</strong> {node.id}
                      <br />
                      <strong>Routing Table:</strong>
                      <table style={{ borderCollapse: 'collapse', marginTop: '4px' }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                              Dest
                            </th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                              Hops
                            </th>
                            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                              Via
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(node.routingTable).map(([destId, route]) => {
                            return (
                              <tr key={destId}>
                                <td style={{ borderBottom: '1px solid #eee', paddingRight: '8px' }}>
                                  {destId}
                                </td>
                                <td style={{ borderBottom: '1px solid #eee', paddingRight: '8px' }}>
                                  {route.hops ?? '-'}
                                </td>
                                <td style={{ borderBottom: '1px solid #eee', paddingRight: '8px' }}>
                                  {route.via ?? '-'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimulationMap;
