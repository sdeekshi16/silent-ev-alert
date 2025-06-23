// src/EVSimulator.js
import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebase';

export default function EVSimulator() {
  const [evId, setEvId] = useState('EV001');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [role, setRole] = useState('ev'); // default to EV rider

  const updateLocation = () => {
    if (latitude && longitude) {
      set(ref(db, `vehicles/${evId}`), {
        id: evId,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        role: role
      });
    }
  };

  return (
    <div>
      <h2>EV GPS Tracker</h2>
      <label>
        EV ID: 
        <input value={evId} onChange={e => setEvId(e.target.value)} />
      </label>
      <br />
      <label>
        Role: 
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="ev">EV Rider</option>
          <option value="pedestrian">Pedestrian</option>
          <option value="non-ev">Non-EV Rider</option>
        </select>
      </label>
      <br />
      <button onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        });
      }}>
        📍 Get Current Location
      </button>
      <br />
      <button onClick={updateLocation}>Update EV Location</button>
    </div>
  );
}
