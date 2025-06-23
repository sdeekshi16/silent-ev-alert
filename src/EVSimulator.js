// src/EVSimulator.js
import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebase';
import ChangeRole from './ChangeRole';
import Navbar from './Navbar';

export default function EVSimulator() {
  const [evId, setEvId] = useState('EV001');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [role, setRole] = useState('ev');
  const [status, setStatus] = useState('');

  const getLocation = () => {
    setStatus("Fetching GPS...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setStatus("Location fetched ✅");
      },
      (err) => {
        setStatus("❌ Unable to fetch location. Check browser permission.");
      }
    );
  };

  const updateLocation = () => {
    if (latitude && longitude) {
      set(ref(db, `vehicles/${evId}`), {
        id: evId,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        role: role
      });
      setStatus("📡 Location updated to Firebase.");
    } else {
      setStatus("⚠️ Latitude & Longitude required.");
    }
  };

  return (
    <div>
      <Navbar role="EV Rider" />
      <div style={styles.container}>
        <h2>🚗 EV GPS Tracker</h2>

        <label>
          EV ID:
          <input
            style={styles.input}
            value={evId}
            onChange={e => setEvId(e.target.value)}
          />
        </label>

        <label>
          Role:
          <select
            style={styles.select}
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="ev">EV Rider</option>
            <option value="pedestrian">Pedestrian</option>
            <option value="non-ev">Non-EV Rider</option>
          </select>
        </label>

        <div>
          <button style={styles.button} onClick={getLocation}>
            📍 Get Current Location
          </button>
          <button style={styles.button} onClick={updateLocation}>
            🔄 Update EV Location
          </button>
        </div>

        {latitude && longitude && (
          <p>
            📌 Lat: {latitude.toFixed(5)} | Lng: {longitude.toFixed(5)}
          </p>
        )}
        <p>{status}</p>

        <ChangeRole />
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
    textAlign: "center"
  },
  input: {
    marginLeft: "10px",
    marginBottom: "10px",
    padding: "5px",
    width: "200px"
  },
  select: {
    marginLeft: "10px",
    marginBottom: "10px",
    padding: "5px"
  },
  button: {
    margin: "10px",
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};
