// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EVSimulator from "./EVSimulator";
import PedestrianAlert from "./PedestrianAlert";
import NonEVAlert from "./NonEVAlert";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ChangeRole from "./ChangeRole";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/ev" element={
          <ProtectedRoute><EVSimulator /></ProtectedRoute>
        } />
        <Route path="/pedestrian" element={
          <ProtectedRoute><PedestrianAlert /></ProtectedRoute>
        } />
        <Route path="/non-ev" element={
          <ProtectedRoute><NonEVAlert /></ProtectedRoute>
        } />
        <Route path="/change-role" element={
          <ProtectedRoute><ChangeRole /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
