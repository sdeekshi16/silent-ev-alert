// src/EVSimulator.js

import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, set } from 'firebase/database';

export default function EVSimulator() {
  const [vehicleId, setVehicleId] = useState("EV001");
  const [location, setLocation] = useState({ lat: null, lng: null });

  // 1. Get GPS location from browser
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("GPS Error:", err);
        },
        { enableHighAccuracy: true }
      );

      // Stop watching on unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert("Geolocation not supported by your browser");
    }
  }, []);

  // 2. Send live location to Firebase every 5 seconds
  useEffect(() => {
    if (location.lat === null || location.lng === null) return;

    const interval = setInterval(() => {
      set(ref(db, 'vehicles/' + vehicleId), {
        id: vehicleId,
        x: location.lat,
        y: location.lng,
        timestamp: Date.now()
      });
    }, 5000); // Update every 5 sec

    return () => clearInterval(interval);
  }, [location, vehicleId]);

  return (
    <div style={{ padding: '20px', border: '1px solid #aaa', borderRadius: '10px' }}>
      <h2>EV GPS Tracker</h2>
      <p>Tracking real-time GPS location and updating Firebase</p>
      <label>
        EV ID:
        <input
          type="text"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </label>
      <p>Latitude: {location.lat ? location.lat.toFixed(6) : "Loading..."}</p>
      <p>Longitude: {location.lng ? location.lng.toFixed(6) : "Loading..."}</p>
    </div>
  );
}
