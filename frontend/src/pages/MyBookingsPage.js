// src/pages/MyBookingsPage.js

import React, { useState, useEffect } from "react";
import { fetchMyBookings, cancelBooking } from "../api/api";
import Navbar from "../components/Navbar";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);  // List of user's bookings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null); // Track which booking is being cancelled

  // Load bookings when the page opens
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchMyBookings();
      setBookings(response.data);  // Expects an array of booking objects
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel a specific booking and refresh the list
  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;

    try {
      setCancellingId(bookingId);  // Show loading state on this booking's button
      await cancelBooking(bookingId);
      // Refresh the bookings list after cancel
      await loadBookings();
    } catch (err) {
      setError("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  // Helper: pick CSS class based on booking status
  const getStatusClass = (status) => {
    if (status === "CANCELLED") return "booking-status status-cancelled";
    return "booking-status status-confirmed";
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">My Bookings</h1>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading state */}
        {loading && <p className="loading-text">⏳ Loading your bookings...</p>}

        {/* No bookings */}
        {!loading && bookings.length === 0 && (
          <div className="card">
            <p className="no-bookings">🎫 You have no bookings yet.</p>
          </div>
        )}

        {/* Booking Cards */}
        {!loading &&
          bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>

              {/* Top row: route + status badge */}
              <div className="booking-card-header">
                <div>
                  <p className="booking-id">Booking #{booking.id}</p>
                  <p className="booking-route">
                    {booking.from || "Origin"} → {booking.to || "Destination"}
                  </p>
                </div>
                <span className={getStatusClass(booking.status)}>
                  {booking.status || "CONFIRMED"}
                </span>
              </div>

              {/* Booking details row */}
              <div className="booking-details">
                {booking.date && (
                  <span>📅 {booking.date}</span>
                )}
                {booking.seatNumbers && (
                  <span>💺 Seats: {booking.seatNumbers.join(", ")}</span>
                )}
                {booking.totalAmount && (
                  <span>💰 ₹{booking.totalAmount}</span>
                )}
                {booking.busName && (
                  <span>🚌 {booking.busName}</span>
                )}
              </div>

              {/* Cancel button — only show if booking is not already cancelled */}
              {booking.status !== "CANCELLED" && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                  style={{ fontSize: 13, padding: "8px 16px" }}
                >
                  {cancellingId === booking.id ? "Cancelling..." : "✕ Cancel Booking"}
                </button>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default MyBookingsPage;
