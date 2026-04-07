// src/api/api.js
// All API calls are centralized here using axios

import axios from "axios";

// Base URL for your backend API — change this to your actual server URL
const BASE_URL = "http://localhost:8080/api";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ─── Seat APIs ────────────────────────────────────────────────────────────────

// Fetch all seats for a given schedule
export const fetchSeats = (scheduleId) =>
  api.get(`/schedules/${scheduleId}/seats`);

// ─── Booking APIs ─────────────────────────────────────────────────────────────

// Create a new booking
export const createBooking = (bookingData) =>
  api.post("/bookings", bookingData);

// Get all bookings for the logged-in user
export const fetchMyBookings = () => api.get("/bookings/my");

// Cancel a booking by ID
export const cancelBooking = (bookingId) =>
  api.delete(`/bookings/${bookingId}/cancel`);

export default api;
