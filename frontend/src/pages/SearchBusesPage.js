import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function SearchBusesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!filters.source || !filters.destination || !filters.date) {
      setError("Source, destination, and travel date are required.");
      return;
    }

    setError("");
    const query = new URLSearchParams(filters).toString();
    navigate(`/buses?${query}`);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="hero-card">
          <div>
            <p className="eyebrow">Bus Booking</p>
            <h1 className="hero-title">Search buses by route and date</h1>
            <p className="muted-text">
              Find the right schedule, compare timings, and continue to seat selection.
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Search Buses</h2>
          {error && <div className="alert alert-error">{error}</div>}

          <form className="stack-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-group">
                <span className="form-label">Source</span>
                <input
                  className="form-input"
                  name="source"
                  type="text"
                  value={filters.source}
                  onChange={handleChange}
                  placeholder="Chennai"
                  required
                />
              </label>

              <label className="form-group">
                <span className="form-label">Destination</span>
                <input
                  className="form-input"
                  name="destination"
                  type="text"
                  value={filters.destination}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  required
                />
              </label>
            </div>

            <label className="form-group">
              <span className="form-label">Travel Date</span>
              <input
                className="form-input"
                name="date"
                type="date"
                value={filters.date}
                onChange={handleChange}
                required
              />
            </label>

            <button className="btn btn-primary" type="submit">
              Search Buses
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SearchBusesPage;
