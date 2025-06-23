// src/PedestrianAlert.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';
import ChangeRole from './ChangeRole';
import Navbar from './Navbar';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = deg => deg * Math.PI / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function PedestrianAlert() {
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [alert, setAlert] = useState('');
  const [evs, setEvs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLng(position.coords.longitude);
    });

    const evRef = ref(db, 'vehicles');
    onValue(evRef, (snapshot) => {
      const data = snapshot.val();
      const evList = [];

      if (data && userLat && userLng) {
        let foundNearby = false;

        Object.values(data).forEach(vehicle => {
          if (vehicle.role === 'ev') {
            const distance = haversine(userLat, userLng, vehicle.lat, vehicle.lng);
            if (distance < 50) {
              foundNearby = true;
              setAlert(`⚠️ EV nearby (${vehicle.id}) at ${distance.toFixed(2)} meters!`);
            }
            evList.push({
              ...vehicle,
              distance: distance.toFixed(2)
            });
          }
        });

        if (!foundNearby) {
          setAlert('');
        }

        setEvs(evList);
      }
    });
  }, [userLat, userLng]);

  return (
    <div>
      <Navbar role="Pedestrian" />
      <div style={styles.container}>
        <h2>🚶 Pedestrian Alert</h2>
        {userLat && userLng && (
          <p>📍 Your location: {userLat.toFixed(5)}, {userLng.toFixed(5)}</p>
        )}
        <p>{alert || '✅ All clear. No EV nearby.'}</p>

        <h4>Nearby EVs:</h4>
        {evs.length > 0 ? (
          evs.map(ev => (
            <p key={ev.id}>
              {ev.id} → {ev.distance} meters
            </p>
          ))
        ) : (
          <p>No EVs in database.</p>
        )}

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
  }
};
