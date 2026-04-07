import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearStoredUser, getStoredUser, isAdmin } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const admin = isAdmin();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/search", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link className="brand-link" to="/search">
        Bus Booking
      </Link>

      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/search">Search</Link>
            {admin && <Link to="/admin">Admin Dashboard</Link>}
            <Link to="/my-bookings">My Bookings</Link>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="nav-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/search">Search</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
