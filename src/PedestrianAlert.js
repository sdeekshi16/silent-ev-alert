import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

export default function PedestrianAlert() {
  const [nearby, setNearby] = useState(false);
  const [evData, setEvData] = useState([]);
  const [userPosition, setUserPosition] = useState({ x: null, y: null });

  const ALERT_RADIUS = 25; // meters — adjust as needed

  // 📍 Get pedestrian's live location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            x: position.coords.latitude,
            y: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation not available");
    }
  }, []);

  // 📏 Haversine formula to calculate distance in meters
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in meters
  }

  // 🚗 Listen for EV updates from Firebase
  useEffect(() => {
    if (userPosition.x === null || userPosition.y === null) return;

    const evRef = ref(db, 'vehicles/');
    const unsubscribe = onValue(evRef, (snapshot) => {
      const vehicles = snapshot.val();
      let isClose = false;
      const allEVs = [];

      for (let id in vehicles) {
        const { x, y } = vehicles[id]; // x = lat, y = lng
        const distance = haversineDistance(userPosition.x, userPosition.y, x, y);

        allEVs.push({ id, x, y, distance });

        if (distance <= ALERT_RADIUS) {
          isClose = true;
        }
      }

      setEvData(allEVs);
      setNearby(isClose);
    });

    return () => unsubscribe();
  }, [userPosition]);

  // 🕒 Wait until location is available
  if (userPosition.x === null || userPosition.y === null) {
    return <p>📍 Getting your live location...</p>;
  }

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #aaa', borderRadius: '10px' }}>
      <h2>Pedestrian Alert</h2>
      <p>Your location: 📍 {userPosition.x.toFixed(5)}, {userPosition.y.toFixed(5)}</p>
      {nearby ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ EV nearby! Please stay alert.</p>
      ) : (
        <p style={{ color: 'green' }}>✅ All clear. No EV nearby.</p>
      )}
      <h4>All EVs:</h4>
      <ul>
        {evData.map((ev) => (
          <li key={ev.id}>
            {ev.id} → Distance: {ev.distance.toFixed(2)} meters
          </li>
        ))}
      </ul>
    </div>
  );
}
