// src/NonEVAlert.js
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = deg => deg * Math.PI / 180;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1), Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NonEVAlert() {
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude);
      setUserLng(position.coords.longitude);
    });

    const vehiclesRef = ref(db, 'vehicles');
    onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();
      const visibleEntities = [];

      if (data && userLat && userLng) {
        Object.values(data).forEach(entity => {
          if (entity.role === 'ev' || entity.role === 'pedestrian') {
            const distance = haversine(userLat, userLng, entity.lat, entity.lng);
            visibleEntities.push({
              id: entity.id,
              role: entity.role,
              distance: distance.toFixed(2)
            });
          }
        });
      }

      setEntities(visibleEntities);
    });
  }, [userLat, userLng]);

  return (
    <div>
      <h2>Non-EV Rider View</h2>
      {userLat && userLng && (
        <p>Your location: 📍 {userLat.toFixed(5)}, {userLng.toFixed(5)}</p>
      )}
      <h4>Nearby EVs & Pedestrians:</h4>
      {entities.length > 0 ? (
        entities.map(ent => (
          <p key={ent.id}>
            {ent.id} ({ent.role}) → {ent.distance} meters
          </p>
        ))
      ) : (
        <p>✅ All clear. No entities nearby.</p>
      )}
    </div>
  );
}
