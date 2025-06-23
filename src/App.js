// src/App.js
import React, { useState } from "react";
import EVSimulator from "./EVSimulator";
import PedestrianAlert from "./PedestrianAlert";

export default function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Select Your Role</h2>
        <button onClick={() => setRole("ev")}>EV Rider</button>
        <button onClick={() => setRole("pedestrian")}>Pedestrian</button>
      </div>
    );
  }

  return role === "ev" ? <EVSimulator /> : <PedestrianAlert />;
}
