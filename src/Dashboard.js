// src/Dashboard.js

import React, { useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const roleRef = ref(db, `users/${user.uid}/role`);
        const snapshot = await get(roleRef);
        const role = snapshot.val();

        if (role === "ev") navigate("/ev");
        else if (role === "pedestrian") navigate("/pedestrian");
        else if (role === "non-ev") navigate("/non-ev");
        else navigate("/register"); // fallback
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return <div>Loading your role-based dashboard...</div>;
};

export default Dashboard;
