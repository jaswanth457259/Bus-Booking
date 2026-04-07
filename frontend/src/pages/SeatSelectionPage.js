// src/pages/SeatSelectionPage.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSeats } from "../api/api";
import Navbar from "../components/Navbar";

function SeatSelectionPage() {
  // Get the schedule ID from the URL (e.g. /seats/42)
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [seats, setSeats] = useState([]);           // All seats from API
  const [selectedSeats, setSelectedSeats] = useState([]); // Seats user clicked
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch seats when the component loads
  useEffect(() => {
    const loadSeats = async () => {
      try {
        setLoading(true);
        const response = await fetchSeats(scheduleId);
        setSeats(response.data);  // Expects an array of seat objects
      } catch (err) {
        setError("Failed to load seats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [scheduleId]);

  // Toggle a seat: if already selected → remove it, else → add it
  const handleSeatClick = (seat) => {
    // Don't allow selecting a booked seat
    if (seat.status === "BOOKED") return;

    setSelectedSeats((prev) => {
      const alreadySelected = prev.find((s) => s.id === seat.id);
      if (alreadySelected) {
        return prev.filter((s) => s.id !== seat.id); // Deselect
      } else {
        return [...prev, seat]; // Select
      }
    });
  };

  // Determine the CSS class for each seat
  const getSeatClass = (seat) => {
    if (seat.status === "BOOKED") return "seat seat-booked";
    const isSelected = selectedSeats.find((s) => s.id === seat.id);
    return isSelected ? "seat seat-selected" : "seat seat-available";
  };

  // Go to confirmation page, passing selected seat data via navigation state
  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate("/confirm-booking", {
      state: {
        scheduleId,
        selectedSeats,
      },
    });
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="page-container">
        <p className="loading-text">⏳ Loading seats...</p>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Select Your Seats</h1>
        <p style={{ color: "#555", marginBottom: 8 }}>
          Schedule ID: <strong>{scheduleId}</strong>
        </p>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="card">
          {seats.length === 0 ? (
            <p className="loading-text">No seats found for this schedule.</p>
          ) : (
            <div className="seat-grid">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  title={seat.status === "BOOKED" ? "Already booked" : `Seat ${seat.seatNumber}`}
                >
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected summary + proceed button */}
        <div className="card">
          <p style={{ marginBottom: 12, fontSize: 15 }}>
            {selectedSeats.length === 0
              ? "No seats selected yet."
              : `Selected: ${selectedSeats.map((s) => s.seatNumber).join(", ")}`}
          </p>
          <button
            className="btn btn-primary"
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Confirm →
          </button>
        </div>
      </div>
    </>
  );
}

export default SeatSelectionPage;
