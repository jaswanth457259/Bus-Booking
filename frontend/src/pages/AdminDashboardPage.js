import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAdminBus,
  createAdminRoute,
  createAdminSchedule,
  deleteAdminBus,
  deleteAdminRoute,
  deleteAdminSchedule,
  fetchAdminDashboard,
} from "../api/api";
import Navbar from "../components/Navbar";
import { getStoredUser } from "../utils/auth";

const DEFAULT_BUS_FORM = {
  busNumber: "",
  busName: "",
  totalSeats: "",
  busType: "AC",
};

const DEFAULT_ROUTE_FORM = {
  source: "",
  destination: "",
  distance: "",
};

const DEFAULT_SCHEDULE_FORM = {
  busId: "",
  routeId: "",
  travelDate: "",
  departureTime: "",
  arrivalTime: "",
  fare: "",
  availableSeats: "",
};

const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const currentDate = getCurrentDate();
  const currentTime = getCurrentTime();
  const admin = getStoredUser();
  const [dashboard, setDashboard] = useState({
    adminName: "",
    buses: [],
    routes: [],
    schedules: [],
  });
  const [busForm, setBusForm] = useState(DEFAULT_BUS_FORM);
  const [routeForm, setRouteForm] = useState(DEFAULT_ROUTE_FORM);
  const [scheduleForm, setScheduleForm] = useState(DEFAULT_SCHEDULE_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedBus = useMemo(
    () => dashboard.buses.find((bus) => String(bus.id) === String(scheduleForm.busId)) || null,
    [dashboard.buses, scheduleForm.busId]
  );
  const isTodaySchedule = scheduleForm.travelDate === currentDate;

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (!scheduleForm.busId && dashboard.buses.length > 0) {
      setScheduleForm((previous) => ({
        ...previous,
        busId: String(dashboard.buses[0].id),
        availableSeats: String(dashboard.buses[0].totalSeats),
      }));
    }
  }, [dashboard.buses, scheduleForm.busId]);

  useEffect(() => {
    if (!scheduleForm.routeId && dashboard.routes.length > 0) {
      setScheduleForm((previous) => ({
        ...previous,
        routeId: String(dashboard.routes[0].id),
      }));
    }
  }, [dashboard.routes, scheduleForm.routeId]);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const response = await fetchAdminDashboard(admin.id);
      setDashboard(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  }

  const handleBusChange = (event) => {
    const { name, value } = event.target;
    setBusForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRouteChange = (event) => {
    const { name, value } = event.target;
    setRouteForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScheduleChange = (event) => {
    const { name, value } = event.target;

    if (name === "busId") {
      const bus = dashboard.buses.find((item) => String(item.id) === value);
      setScheduleForm((previous) => ({
        ...previous,
        busId: value,
        availableSeats: bus ? String(bus.totalSeats) : previous.availableSeats,
      }));
      return;
    }

    setScheduleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCreateBus = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createAdminBus(admin.id, {
        busNumber: busForm.busNumber,
        busName: busForm.busName,
        totalSeats: Number(busForm.totalSeats),
        busType: busForm.busType,
      });
      setBusForm(DEFAULT_BUS_FORM);
      setSuccess("Bus created successfully.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create bus.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateRoute = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createAdminRoute(admin.id, {
        source: routeForm.source,
        destination: routeForm.destination,
        distance: Number(routeForm.distance),
      });
      setRouteForm(DEFAULT_ROUTE_FORM);
      setSuccess("Route created successfully.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create route.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateSchedule = async (event) => {
    event.preventDefault();

    if (scheduleForm.travelDate < currentDate) {
      setError("Travel date cannot be in the past.");
      return;
    }

    if (scheduleForm.travelDate === currentDate && scheduleForm.departureTime < currentTime) {
      setError("Departure time cannot be in the past for today's schedule.");
      return;
    }

    if (scheduleForm.arrivalTime <= scheduleForm.departureTime) {
      setError("Arrival time must be later than departure time.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      await createAdminSchedule(admin.id, {
        busId: Number(scheduleForm.busId),
        routeId: Number(scheduleForm.routeId),
        travelDate: scheduleForm.travelDate,
        departureTime: scheduleForm.departureTime,
        arrivalTime: scheduleForm.arrivalTime,
        fare: Number(scheduleForm.fare),
        availableSeats: Number(scheduleForm.availableSeats),
      });
      setScheduleForm((previous) => ({
        ...DEFAULT_SCHEDULE_FORM,
        busId: previous.busId,
        routeId: previous.routeId,
        availableSeats: selectedBus ? String(selectedBus.totalSeats) : "",
      }));
      setSuccess("Schedule created successfully.");
      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to create schedule.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (type, id) => {
    const confirmed = window.confirm(`Delete this ${type}?`);
    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (type === "bus") {
        await deleteAdminBus(admin.id, id);
        setSuccess("Bus deleted successfully.");
      } else if (type === "route") {
        await deleteAdminRoute(admin.id, id);
        setSuccess("Route deleted successfully.");
      } else {
        await deleteAdminSchedule(admin.id, id);
        setSuccess("Schedule deleted successfully.");
      }

      await loadDashboard();
    } catch (requestError) {
      setError(requestError.response?.data?.message || `Failed to delete ${type}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-actions">
          <h1 className="page-title">Admin Dashboard</h1>
          <button className="btn btn-secondary" type="button" onClick={() => navigate("/search")}>
            Back to Search
          </button>
        </div>

        <div className="hero-card">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="hero-title">Manage buses, routes, and schedules</h1>
            <p className="muted-text">
              Signed in as {dashboard.adminName || admin.name}. Use this dashboard to add project data
              and remove items that are no longer needed.
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {loading && <p className="loading-text">Loading admin dashboard...</p>}

        {!loading && (
          <>
            <div className="admin-grid">
              <div className="card">
                <h2 className="section-title">Add Bus</h2>
                <form className="stack-form" onSubmit={handleCreateBus}>
                  <label className="form-group">
                    <span className="form-label">Bus Number</span>
                    <input
                      className="form-input"
                      name="busNumber"
                      value={busForm.busNumber}
                      onChange={handleBusChange}
                      placeholder="TN01AB1234"
                      required
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Bus Name</span>
                    <input
                      className="form-input"
                      name="busName"
                      value={busForm.busName}
                      onChange={handleBusChange}
                      placeholder="GreenLine Express"
                      required
                    />
                  </label>
                  <div className="form-grid">
                    <label className="form-group">
                      <span className="form-label">Total Seats</span>
                      <input
                        className="form-input"
                        name="totalSeats"
                        type="number"
                        min="1"
                        value={busForm.totalSeats}
                        onChange={handleBusChange}
                        required
                      />
                    </label>
                    <label className="form-group">
                      <span className="form-label">Bus Type</span>
                      <select
                        className="form-input"
                        name="busType"
                        value={busForm.busType}
                        onChange={handleBusChange}
                      >
                        <option value="AC">AC</option>
                        <option value="NON_AC">NON_AC</option>
                        <option value="SLEEPER">SLEEPER</option>
                      </select>
                    </label>
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Create Bus"}
                  </button>
                </form>
              </div>

              <div className="card">
                <h2 className="section-title">Add Route</h2>
                <form className="stack-form" onSubmit={handleCreateRoute}>
                  <label className="form-group">
                    <span className="form-label">Source</span>
                    <input
                      className="form-input"
                      name="source"
                      value={routeForm.source}
                      onChange={handleRouteChange}
                      placeholder="Chennai"
                      required
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Destination</span>
                    <input
                      className="form-input"
                      name="destination"
                      value={routeForm.destination}
                      onChange={handleRouteChange}
                      placeholder="Bengaluru"
                      required
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Distance (km)</span>
                    <input
                      className="form-input"
                      name="distance"
                      type="number"
                      min="1"
                      step="0.1"
                      value={routeForm.distance}
                      onChange={handleRouteChange}
                      required
                    />
                  </label>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Create Route"}
                  </button>
                </form>
              </div>
            </div>

            <div className="card">
              <h2 className="section-title">Add Schedule</h2>
              <form className="stack-form" onSubmit={handleCreateSchedule}>
                <div className="form-grid">
                  <label className="form-group">
                    <span className="form-label">Bus</span>
                    <select
                      className="form-input"
                      name="busId"
                      value={scheduleForm.busId}
                      onChange={handleScheduleChange}
                      required
                    >
                      <option value="">Select Bus</option>
                      {dashboard.buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.busName} ({bus.busNumber})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="form-group">
                    <span className="form-label">Route</span>
                    <select
                      className="form-input"
                      name="routeId"
                      value={scheduleForm.routeId}
                      onChange={handleScheduleChange}
                      required
                    >
                      <option value="">Select Route</option>
                      {dashboard.routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.source} to {route.destination}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="form-grid">
                  <label className="form-group">
                    <span className="form-label">Travel Date</span>
                    <input
                      className="form-input"
                      name="travelDate"
                      type="date"
                      min={currentDate}
                      value={scheduleForm.travelDate}
                      onChange={handleScheduleChange}
                      required
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Fare</span>
                    <input
                      className="form-input"
                      name="fare"
                      type="number"
                      min="1"
                      step="0.01"
                      value={scheduleForm.fare}
                      onChange={handleScheduleChange}
                      required
                    />
                  </label>
                </div>

                <div className="form-grid">
                  <label className="form-group">
                    <span className="form-label">Departure Time</span>
                    <input
                      className="form-input"
                      name="departureTime"
                      type="time"
                      min={isTodaySchedule ? currentTime : undefined}
                      value={scheduleForm.departureTime}
                      onChange={handleScheduleChange}
                      required
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Arrival Time</span>
                    <input
                      className="form-input"
                      name="arrivalTime"
                      type="time"
                      value={scheduleForm.arrivalTime}
                      onChange={handleScheduleChange}
                      required
                    />
                  </label>
                </div>

                <label className="form-group">
                  <span className="form-label">Available Seats</span>
                  <input
                    className="form-input"
                    name="availableSeats"
                    type="number"
                    min="0"
                    max={selectedBus?.totalSeats || ""}
                    value={scheduleForm.availableSeats}
                    onChange={handleScheduleChange}
                    required
                  />
                </label>

                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={submitting || dashboard.buses.length === 0 || dashboard.routes.length === 0}
                >
                  {submitting ? "Saving..." : "Create Schedule"}
                </button>
              </form>
            </div>

            <div className="admin-list-grid">
              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">Buses</h2>
                  <span className="muted-text">{dashboard.buses.length} total</span>
                </div>
                <div className="admin-list">
                  {dashboard.buses.map((bus) => (
                    <div className="admin-list-item" key={bus.id}>
                      <div>
                        <strong>{bus.busName}</strong>
                        <p className="muted-text">
                          {bus.busNumber} | {bus.busType} | {bus.totalSeats} seats
                        </p>
                      </div>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => handleDelete("bus", bus.id)}
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="section-header">
                  <h2 className="section-title">Routes</h2>
                  <span className="muted-text">{dashboard.routes.length} total</span>
                </div>
                <div className="admin-list">
                  {dashboard.routes.map((route) => (
                    <div className="admin-list-item" key={route.id}>
                      <div>
                        <strong>
                          {route.source} to {route.destination}
                        </strong>
                        <p className="muted-text">{route.distance} km</p>
                      </div>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => handleDelete("route", route.id)}
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-header">
                <h2 className="section-title">Schedules</h2>
                <span className="muted-text">{dashboard.schedules.length} total</span>
              </div>
              <div className="admin-list">
                {dashboard.schedules.map((schedule) => (
                  <div className="admin-list-item" key={schedule.id}>
                    <div>
                      <strong>
                        {schedule.busName} | {schedule.source} to {schedule.destination}
                      </strong>
                      <p className="muted-text">
                        {schedule.travelDate} | {schedule.departureTime} to {schedule.arrivalTime} | INR{" "}
                        {schedule.fare} | {schedule.availableSeats} seats left
                      </p>
                    </div>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => handleDelete("schedule", schedule.id)}
                      disabled={submitting}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AdminDashboardPage;
