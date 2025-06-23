// src/Login.js

import React, { useState } from "react";
import { auth, googleProvider, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const redirectToRolePage = async (uid) => {
    const snapshot = await get(ref(db, `users/${uid}/role`));
    const role = snapshot.val();

    if (role === "ev") navigate("/ev");
    else if (role === "pedestrian") navigate("/pedestrian");
    else if (role === "non-ev") navigate("/non-ev");
    else alert("Role not set. Please register first.");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      redirectToRolePage(res.user.uid);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      redirectToRolePage(res.user.uid);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const res = await signInAnonymously(auth);
      redirectToRolePage(res.user.uid);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login">
      <h2>Login to SilentEV Alert</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <hr />

      <button onClick={handleGoogleLogin}>Login with Google</button>
      <button onClick={handleAnonymousLogin}>Continue as Guest</button>
    </div>
  );
};

export default Login;
