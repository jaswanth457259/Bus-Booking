// src/pages/BookingConfirmationPage.js

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/api";
import Navbar from "../components/Navbar";

function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from SeatSelectionPage via navigation state
  const { scheduleId, selectedSeats } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If someone lands here directly without selecting seats
  if (!scheduleId || !selectedSeats || selectedSeats.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="alert alert-error">
            No seat data found. Please go back and select seats.
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </>
    );
  }

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Calculate total price (assuming each seat has a `price` field)
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);

  // Confirm the booking by calling POST /api/bookings
  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");

      // Build the request body
      const bookingPayload = {
        scheduleId: scheduleId,
        seatIds: selectedSeats.map((s) => s.id),
        userId: user.id,
      };

      await createBooking(bookingPayload);

      // Success → go to My Bookings page
      navigate("/my-bookings", { replace: true });
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Confirm Your Booking</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Booking Details Card */}
        <div className="card">
          <h3 style={{ marginBottom: 16, color: "#1a73e8" }}>Booking Summary</h3>

          <div className="detail-row">
            <span className="detail-label">Schedule ID</span>
            <span className="detail-value">{scheduleId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Passenger</span>
            <span className="detail-value">{user.name || "Guest"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Selected Seats</span>
            <span className="detail-value">
              {selectedSeats.map((s) => s.seatNumber).join(", ")}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Number of Seats</span>
            <span className="detail-value">{selectedSeats.length}</span>
          </div>

          {totalPrice > 0 && (
            <div className="detail-row">
              <span className="detail-label">Total Price</span>
              <span className="detail-value" style={{ color: "#1a73e8" }}>
                ₹{totalPrice}
              </span>
            </div>
          )}
        </div>

        {/* Seat breakdown */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Seat Details</h3>
          {selectedSeats.map((seat) => (
            <div className="detail-row" key={seat.id}>
              <span className="detail-label">Seat {seat.seatNumber}</span>
              <span className="detail-value">
                {seat.type || "Standard"}{seat.price ? ` — ₹${seat.price}` : ""}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            ← Change Seats
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Booking..." : "✔ Confirm Booking"}
          </button>
        </div>
      </div>
    </>
  );
}

export default BookingConfirmationPage;
