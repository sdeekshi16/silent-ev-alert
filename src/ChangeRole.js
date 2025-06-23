// src/ChangeRole.js

import React, { useState } from "react";
import { auth, db } from "./firebase";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const ChangeRole = () => {
  const [role, setRole] = useState("pedestrian");
  const navigate = useNavigate();

  const handleChange = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("User not signed in.");
      return;
    }

    try {
      await set(ref(db, `users/${user.uid}/role`), role);
      if (role === "ev") navigate("/ev");
      else if (role === "pedestrian") navigate("/pedestrian");
      else if (role === "non-ev") navigate("/non-ev");
    } catch (err) {
      alert("Failed to update role.");
    }
  };

  return (
    <div className="change-role">
      <h3>Change Your Role</h3>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="ev">EV Rider</option>
        <option value="pedestrian">Pedestrian</option>
        <option value="non-ev">Non-EV Rider</option>
      </select>
      <button onClick={handleChange}>Update Role</button>
    </div>
  );
};

export default ChangeRole;
