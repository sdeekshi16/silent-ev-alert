// src/Navbar.js
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoSection}>
        <img src="/logo.png" alt="SilentEV Logo" style={styles.logoImg} />
        <span style={styles.logoText}>SilentEV Alert</span>
      </div>
      {role && <span style={styles.role}>👤 Role: {role}</span>}
      <button style={styles.btn} onClick={() => navigate("/change-role")}>
        Change Role
      </button>
      <button style={styles.btn} onClick={handleLogout}>Logout</button>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#003366",
    color: "white",
    padding: "10px",
    alignItems: "center"
  },
  logoSection: {
    display: "flex",
    alignItems: "center"
  },
  logoImg: {
    height: "32px",
    marginRight: "10px"
  },
  logoText: {
    fontWeight: "bold",
    fontSize: "18px"
  },
  role: {
    marginRight: "auto",
    marginLeft: "20px"
  },
  btn: {
    marginLeft: "10px",
    padding: "6px 12px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default Navbar;
