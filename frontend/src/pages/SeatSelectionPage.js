import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSeats } from "../api/api";
import Navbar from "../components/Navbar";
import { isAuthenticated } from "../utils/auth";

function SeatSelectionPage() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSeats() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchSeats(scheduleId);
        setSchedule(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load seat data.");
      } finally {
        setLoading(false);
      }
    }

    loadSeats();
  }, [scheduleId]);

  const seats = useMemo(() => schedule?.seats || [], [schedule]);

  const toggleSeat = (seat) => {
    if (seat.status === "BOOKED") {
      return;
    }

    setSelectedSeatNumbers((previous) => {
      if (previous.includes(seat.seatNumber)) {
        return previous.filter((value) => value !== seat.seatNumber);
      }

      return [...previous, seat.seatNumber].sort((left, right) => left - right);
    });
  };

  const getSeatClass = (seat) => {
    if (seat.status === "BOOKED") {
      return "seat seat-booked";
    }

    if (selectedSeatNumbers.includes(seat.seatNumber)) {
      return "seat seat-selected";
    }

    return "seat seat-available";
  };

  const bookingState = {
    schedule,
    selectedSeatNumbers,
  };

  const handleProceed = () => {
    if (!schedule || selectedSeatNumbers.length === 0) {
      return;
    }

    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      return;
    }

    navigate("/confirm-booking", {
      state: bookingState,
    });
  };

  const handleAuthRedirect = (path) => {
    navigate(path, {
      state: {
        from: "/confirm-booking",
        bookingState,
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-actions">
          <div>
            <h1 className="page-title">Select Seats</h1>
            {schedule && (
              <p className="muted-text">
                {schedule.source} to {schedule.destination} | {schedule.travelDate}
              </p>
            )}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <p className="loading-text">Loading seats...</p>}

        {!loading && schedule && (
          <>
            <div className="card">
              <div className="info-grid">
                <div>
                  <span className="info-label">Bus</span>
                  <strong>
                    {schedule.busName} ({schedule.busNumber})
                  </strong>
                </div>
                <div>
                  <span className="info-label">Time</span>
                  <strong>
                    {schedule.departureTime} to {schedule.arrivalTime}
                  </strong>
                </div>
                <div>
                  <span className="info-label">Fare Per Seat</span>
                  <strong>INR {schedule.fare}</strong>
                </div>
                <div>
                  <span className="info-label">Available Seats</span>
                  <strong>{schedule.availableSeats}</strong>
                </div>
              </div>
            </div>

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

            <div className="card">
              <div className="seat-grid">
                {seats.map((seat) => (
                  <button
                    key={seat.seatNumber}
                    className={getSeatClass(seat)}
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    disabled={seat.status === "BOOKED"}
                    title={`Seat ${seat.seatNumber}`}
                  >
                    {seat.seatNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Selection Summary</h2>
              <p className="muted-text">
                {selectedSeatNumbers.length > 0
                  ? `Selected seats: ${selectedSeatNumbers.join(", ")}`
                  : "Choose one or more available seats to continue."}
              </p>
              <div className="button-row">
                <button className="btn btn-primary" onClick={handleProceed} disabled={selectedSeatNumbers.length === 0}>
                  Proceed to Confirm
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showAuthPrompt && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-prompt-title">
            <h2 className="section-title" id="auth-prompt-title">
              Login Required to Continue
            </h2>
            <p className="muted-text">
              You can search and choose seats without signing in. To continue with booking seats{" "}
              {selectedSeatNumbers.join(", ")}, please login or create an account.
            </p>
            <div className="button-row">
              <button className="btn btn-primary" type="button" onClick={() => handleAuthRedirect("/login")}>
                Login
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => handleAuthRedirect("/register")}>
                Register
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setShowAuthPrompt(false)}>
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SeatSelectionPage;
