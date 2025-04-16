import React, { useState } from 'react';
import { Container, FormControlLabel, Switch } from '@mui/material';
import { SimulationProvider } from './context/SimulationContext';
import LiveSimulationMap from './components/LiveSimulationMap';
import LogSimulationMap from './components/LogSimulationMap';
import NodeControlPanel from './components/NodeControlPanel';
import logData from './assets/log_2025-02-12_11-55-45.log?raw';

function App() {
  // Toggle between live simulation and log-based simulation.
  const [liveMode, setLiveMode] = useState<boolean>(true);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveMode(event.target.checked);
  };

  return (
    <SimulationProvider>
      <Container maxWidth="md" style={{ width: '100%', height: '100vh' }}>
        <FormControlLabel
          control={<Switch checked={liveMode} onChange={handleToggle}  />}
          label="Live Simulation"
        />
        {liveMode ? (
          <>
            <LiveSimulationMap />
            <NodeControlPanel />
          </>
        ) : (
          <LogSimulationMap logData={logData} />
        )}
      </Container>
    </SimulationProvider>
  );
}

export default App;
