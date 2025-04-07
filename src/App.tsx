// import React from 'react';
import SimulationMap from './components/SimulationMap';
import NodeControlPannel from './components/NodeControlPanel' 

// Import the entire log file as a raw string
import logData from './assets/log_2025-02-12_11-55-45.log?raw';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <NodeControlPannel />
      {/* Pass the logData string into the SimulationMap component */}
      <SimulationMap logData={logData} />
    </div>
  );
}

export default App;
