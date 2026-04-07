// src/App.js
// Main app file — sets up routing between all pages

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SeatSelectionPage from "./pages/SeatSelectionPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import MyBookingsPage from "./pages/MyBookingsPage";

import "./styles/global.css";

function App() {
  return (
    <Router>
      <Routes>
        {/*
          Route 1: Seat Selection
          URL: /seats/:scheduleId
          Example: /seats/101
        */}
        <Route path="/seats/:scheduleId" element={<SeatSelectionPage />} />

        {/*
          Route 2: Booking Confirmation
          URL: /confirm-booking
          Receives data via React Router's `location.state`
        */}
        <Route path="/confirm-booking" element={<BookingConfirmationPage />} />

        {/*
          Route 3: My Bookings
          URL: /my-bookings
        */}
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        {/*
          Default: redirect to My Bookings
          (You can change this to a home/search page later)
        */}
        <Route path="*" element={<Navigate to="/my-bookings" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
