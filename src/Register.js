// src/Register.js

import React, { useState } from "react";
import { auth, db, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("pedestrian");
  const navigate = useNavigate();

  const saveUserRole = (uid, selectedRole) => {
    set(ref(db, `users/${uid}`), { role: selectedRole });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      saveUserRole(res.user.uid, role);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      saveUserRole(res.user.uid, role); // Save role only if first time
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAnonymous = async () => {
    try {
      const res = await signInAnonymously(auth);
      saveUserRole(res.user.uid, role);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="register">
      <h2>Register to SilentEV Alert</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ev">EV Rider</option>
          <option value="pedestrian">Pedestrian</option>
          <option value="non-ev">Non-EV Rider</option>
        </select>

        <button type="submit">Register with Email</button>
      </form>

      <hr />

      <button onClick={handleGoogle}>Continue with Google</button>
      <button onClick={handleAnonymous}>Continue Anonymously</button>
    </div>
  );
};

export default Register;
