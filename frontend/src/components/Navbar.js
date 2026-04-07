// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  // Get the logged-in user's name from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="navbar">
      <h2>🚌 BusBook</h2>
      <div>
        {user.name && <span style={{ marginRight: 16 }}>Hi, {user.name}</span>}
        <Link to="/my-bookings">My Bookings</Link>
      </div>
    </nav>
  );
}

export default Navbar;
