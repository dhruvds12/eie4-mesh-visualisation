// import React from 'react';
import SimulationMap from './components/SimulationMap';

// Import the entire log file as a raw string
import logData from './assets/log_2025-01-29_23-17-25.log?raw';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* Pass the logData string into the SimulationMap component */}
      <SimulationMap logData={logData} />
    </div>
  );
}

export default App;
