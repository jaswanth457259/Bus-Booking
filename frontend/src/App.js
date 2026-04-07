import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BusListPage from "./pages/BusListPage";
import LoginPage from "./pages/LoginPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import RegisterPage from "./pages/RegisterPage";
import SearchBusesPage from "./pages/SearchBusesPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import "./styles/global.css";

const THEME_STORAGE_KEY = "bus-booking-theme";

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

function App() {
  const defaultRoute = "/search";
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <Router>
      <button
        className="theme-toggle-fab"
        type="button"
        onClick={() => setTheme((previous) => (previous === "dark" ? "light" : "dark"))}
      >
        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      </button>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchBusesPage />} />
        <Route path="/buses" element={<BusListPage />} />
        <Route path="/seats/:scheduleId" element={<SeatSelectionPage />} />
        <Route path="/confirm-booking" element={<BookingConfirmationPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to={defaultRoute} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
