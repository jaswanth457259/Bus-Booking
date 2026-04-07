import React, { useEffect, useState } from "react";
import { cancelBooking, fetchMyBookings } from "../api/api";
import Navbar from "../components/Navbar";
import { getStoredUser } from "../utils/auth";

function MyBookingsPage() {
  const user = getStoredUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError("");
        const response = await fetchMyBookings(user.id);
        setBookings(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [user.id]);

  const handleCancel = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      const response = await fetchMyBookings(user.id);
      setBookings(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="page-title">My Bookings</h1>
        {error && <div className="alert alert-error">{error}</div>}

        {loading && <p className="loading-text">Loading your bookings...</p>}

        {!loading && bookings.length === 0 && (
          <div className="card empty-state">
            <h2 className="section-title">No bookings yet</h2>
            <p className="muted-text">Your confirmed trips will appear here.</p>
          </div>
        )}

        {!loading &&
          bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-card-header">
                <div>
                  <p className="booking-id">Booking #{booking.id}</p>
                  <p className="booking-route">
                    {booking.source} to {booking.destination}
                  </p>
                </div>
                <span
                  className={
                    booking.status === "CANCELLED"
                      ? "booking-status status-cancelled"
                      : "booking-status status-confirmed"
                  }
                >
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <span>Date: {booking.travelDate}</span>
                <span>Time: {booking.departureTime} to {booking.arrivalTime}</span>
                <span>Seats: {booking.seatNumbers}</span>
                <span>Total: INR {booking.totalFare}</span>
                <span>Bus: {booking.busName}</span>
              </div>

              {booking.status !== "CANCELLED" && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleCancel(booking.id)}
                  disabled={cancellingId === booking.id}
                >
                  {cancellingId === booking.id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default MyBookingsPage;
