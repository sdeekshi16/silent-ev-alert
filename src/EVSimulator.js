// src/EVSimulator.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, set } from "firebase/database";

const EV_ID = "EV001";

export default function EVSimulator() {
  const [coords, setCoords] = useState({ lat: null, lng: null });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        set(ref(db, `vehicles/${EV_ID}`), {
          lat: latitude,
          lng: longitude,
          timestamp: Date.now()
        });
      },
      (err) => console.error("GPS error", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>EV GPS Tracker</h2>
      <p>EV ID: {EV_ID}</p>
      <p>Latitude: {coords.lat ?? "Loading..."}</p>
      <p>Longitude: {coords.lng ?? "Loading..."}</p>
    </div>
  );
}
