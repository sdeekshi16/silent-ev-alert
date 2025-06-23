// src/PedestrianAlert.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function PedestrianAlert() {
  const [userLoc, setUserLoc] = useState({ lat: null, lng: null });
  const [vehicles, setVehicles] = useState([]);
  const [nearest, setNearest] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error("Location error", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const vehiclesRef = ref(db, "vehicles");
    onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || !userLoc.lat) return;

      const results = Object.entries(data).map(([id, v]) => {
        const distance = getDistance(userLoc.lat, userLoc.lng, v.lat, v.lng);
        return { id, distance };
      });

      setVehicles(results);
      const closest = results.reduce((min, curr) =>
        curr.distance < min.distance ? curr : min,
        { id: null, distance: Infinity }
      );
      setNearest(closest);
    });
  }, [userLoc]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Pedestrian Alert</h2>
      <p>Your location: 📍 {userLoc.lat?.toFixed(5)}, {userLoc.lng?.toFixed(5)}</p>

      {nearest?.distance < 15 ? (
        <div style={{ color: "red", fontWeight: "bold" }}>
          ⚠️ EV nearby ({nearest.id}) at {nearest.distance.toFixed(2)} meters!
        </div>
      ) : (
        <p>✅ All clear. No EV nearby.</p>
      )}

      <div>
        <h3>All EVs:</h3>
        {vehicles.map((v) => (
          <p key={v.id}>{v.id} → {v.distance.toFixed(2)} meters</p>
        ))}
      </div>
    </div>
  );
}
