import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = (payload) => api.post("/auth/register", payload);

export const loginUser = (payload) => api.post("/auth/login", payload);

export const searchBuses = (params) => api.get("/buses/search", { params });

export const fetchBusDetails = (busId) => api.get(`/buses/${busId}`);

export const fetchSeats = (scheduleId) => api.get(`/schedules/${scheduleId}/seats`);

export const createBooking = (payload) => api.post("/bookings", payload);

export const fetchMyBookings = (userId) =>
  api.get("/bookings/my", {
    params: { userId },
  });

export const cancelBooking = (bookingId) => api.delete(`/bookings/${bookingId}/cancel`);

export const fetchAdminDashboard = (adminUserId) =>
  api.get("/admin/dashboard", {
    params: { adminUserId },
  });

export const createAdminBus = (adminUserId, payload) =>
  api.post("/admin/buses", payload, {
    params: { adminUserId },
  });

export const deleteAdminBus = (adminUserId, busId) =>
  api.delete(`/admin/buses/${busId}`, {
    params: { adminUserId },
  });

export const createAdminRoute = (adminUserId, payload) =>
  api.post("/admin/routes", payload, {
    params: { adminUserId },
  });

export const deleteAdminRoute = (adminUserId, routeId) =>
  api.delete(`/admin/routes/${routeId}`, {
    params: { adminUserId },
  });

export const createAdminSchedule = (adminUserId, payload) =>
  api.post("/admin/schedules", payload, {
    params: { adminUserId },
  });

export const deleteAdminSchedule = (adminUserId, scheduleId) =>
  api.delete(`/admin/schedules/${scheduleId}`, {
    params: { adminUserId },
  });

export default api;
