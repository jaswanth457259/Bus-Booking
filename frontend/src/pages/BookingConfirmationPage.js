import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/api";
import Navbar from "../components/Navbar";
import { getStoredUser } from "../utils/auth";

function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();
  const { schedule, selectedSeatNumbers } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalFare = useMemo(() => {
    const farePerSeat = Number(schedule?.fare || 0);
    return farePerSeat * (selectedSeatNumbers?.length || 0);
  }, [schedule, selectedSeatNumbers]);

  const authNavigationState = {
    from: "/confirm-booking",
    bookingState: {
      schedule,
      selectedSeatNumbers,
    },
  };

  if (!schedule || !selectedSeatNumbers || selectedSeatNumbers.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="alert alert-error">
            Booking data is missing. Please choose your seats again.
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/search")}>
            Go to Search
          </button>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="card">
            <h1 className="page-title">Login to Complete Booking</h1>
            <p className="muted-text page-subtitle">
              Your seats are ready. Please login or register to confirm this trip.
            </p>

            <div className="detail-row">
              <span className="detail-label">Route</span>
              <span className="detail-value">
                {schedule.source} to {schedule.destination}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Travel Date</span>
              <span className="detail-value">{schedule.travelDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Selected Seats</span>
              <span className="detail-value">{selectedSeatNumbers.join(", ")}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Fare</span>
              <span className="detail-value">INR {totalFare}</span>
            </div>

            <div className="button-row">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => navigate("/login", { state: authNavigationState })}
              >
                Login
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/register", { state: authNavigationState })}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");

      await createBooking({
        userId: user.id,
        scheduleId: schedule.scheduleId,
        numberOfSeats: selectedSeatNumbers.length,
        seatNumbers: selectedSeatNumbers.join(","),
      });

      navigate("/my-bookings", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">Confirm Booking</h1>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card">
          <h2 className="section-title">Trip Summary</h2>
          <div className="detail-row">
            <span className="detail-label">Passenger</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Route</span>
            <span className="detail-value">
              {schedule.source} to {schedule.destination}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Travel Date</span>
            <span className="detail-value">{schedule.travelDate}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Departure</span>
            <span className="detail-value">{schedule.departureTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Arrival</span>
            <span className="detail-value">{schedule.arrivalTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bus</span>
            <span className="detail-value">
              {schedule.busName} ({schedule.busNumber})
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Selected Seats</span>
            <span className="detail-value">{selectedSeatNumbers.join(", ")}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Fare</span>
            <span className="detail-value">INR {totalFare}</span>
          </div>
        </div>

        <div className="button-row">
          <button className="btn btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
            Change Seats
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={loading}>
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </>
  );
}

export default BookingConfirmationPage;
