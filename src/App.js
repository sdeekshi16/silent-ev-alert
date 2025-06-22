import React from 'react';
import EVSimulator from './EVSimulator';
import PedestrianAlert from './PedestrianAlert';

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>SilentEV Alert</h1>
      <EVSimulator />
      <PedestrianAlert />
    </div>
  );
}

export default App;
