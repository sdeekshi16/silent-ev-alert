import React, { useState } from 'react';
import EVSimulator from './EVSimulator';
import PedestrianAlert from './PedestrianAlert';
import NonEVAlert from './NonEVAlert';

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Select Your Role</h2>
        <button onClick={() => setRole('ev')}>EV Rider</button>
        <button onClick={() => setRole('pedestrian')}>Pedestrian</button>
        <button onClick={() => setRole('nonev')}>Non-EV Rider</button>
      </div>
    );
  }

  if (role === 'ev') return <EVSimulator />;
  if (role === 'pedestrian') return <PedestrianAlert />;
  if (role === 'nonev') return <NonEVAlert />;

  return null;
}

export default App;
