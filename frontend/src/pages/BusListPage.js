import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchBusDetails, searchBuses } from "../api/api";
import Navbar from "../components/Navbar";

function BusListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [busDetailsById, setBusDetailsById] = useState({});
  const [expandedBusId, setExpandedBusId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({
      source: searchParams.get("source") || "",
      destination: searchParams.get("destination") || "",
      date: searchParams.get("date") || "",
    }),
    [searchParams]
  );

  useEffect(() => {
    async function loadResults() {
      if (!filters.source || !filters.destination || !filters.date) {
        setResults([]);
        setLoading(false);
        setError("Search filters are missing. Please search again.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await searchBuses(filters);
        setResults(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Failed to fetch buses.");
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [filters]);

  const handleViewDetails = async (busId) => {
    if (expandedBusId === busId) {
      setExpandedBusId(null);
      return;
    }

    if (busDetailsById[busId]) {
      setExpandedBusId(busId);
      return;
    }

    try {
      setDetailsLoadingId(busId);
      const response = await fetchBusDetails(busId);
      setBusDetailsById((previous) => ({
        ...previous,
        [busId]: response.data,
      }));
      setExpandedBusId(busId);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Failed to fetch bus details.");
    } finally {
      setDetailsLoadingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-actions">
          <div>
            <h1 className="page-title">Available Buses</h1>
            <p className="muted-text">
              {filters.source} to {filters.destination} on {filters.date}
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/search")}>
            Edit Search
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading && <p className="loading-text">Loading buses...</p>}

        {!loading && results.length === 0 && (
          <div className="card empty-state">
            <h2 className="section-title">No buses found</h2>
            <p className="muted-text">Try a different route or travel date.</p>
          </div>
        )}

        {!loading &&
          results.map((bus) => {
            const busDetails = busDetailsById[bus.busId];

            return (
              <div className="card bus-card" key={bus.scheduleId}>
                <div className="bus-card-header">
                  <div>
                    <h2 className="section-title">{bus.busName}</h2>
                    <p className="muted-text">
                      {bus.busNumber} | {bus.busType}
                    </p>
                  </div>
                  <span className="price-badge">INR {bus.fare}</span>
                </div>

                <div className="info-grid">
                  <div>
                    <span className="info-label">Route</span>
                    <strong>
                      {bus.source} to {bus.destination}
                    </strong>
                  </div>
                  <div>
                    <span className="info-label">Travel Date</span>
                    <strong>{bus.travelDate}</strong>
                  </div>
                  <div>
                    <span className="info-label">Departure</span>
                    <strong>{bus.departureTime}</strong>
                  </div>
                  <div>
                    <span className="info-label">Arrival</span>
                    <strong>{bus.arrivalTime}</strong>
                  </div>
                  <div>
                    <span className="info-label">Available Seats</span>
                    <strong>{bus.availableSeats}</strong>
                  </div>
                  <div>
                    <span className="info-label">Schedule ID</span>
                    <strong>{bus.scheduleId}</strong>
                  </div>
                </div>

                <div className="button-row">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(bus.busId)}
                    disabled={detailsLoadingId === bus.busId}
                  >
                    {detailsLoadingId === bus.busId
                      ? "Loading Details..."
                      : expandedBusId === bus.busId
                        ? "Hide Details"
                        : "View Bus Details"}
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/seats/${bus.scheduleId}`)}
                  >
                    Select Seats
                  </button>
                </div>

                {expandedBusId === bus.busId && busDetails && (
                  <div className="detail-panel">
                    <h3 className="section-title">Bus Details</h3>
                    <div className="info-grid">
                      <div>
                        <span className="info-label">Bus Number</span>
                        <strong>{busDetails.busNumber}</strong>
                      </div>
                      <div>
                        <span className="info-label">Total Seats</span>
                        <strong>{busDetails.totalSeats}</strong>
                      </div>
                      <div>
                        <span className="info-label">Bus Type</span>
                        <strong>{busDetails.busType}</strong>
                      </div>
                    </div>

                    {busDetails.schedules?.length > 0 && (
                      <div className="schedule-list">
                        {busDetails.schedules.map((schedule) => (
                          <div className="schedule-card" key={schedule.scheduleId}>
                            <strong>
                              {schedule.source} to {schedule.destination}
                            </strong>
                            <span>
                              {schedule.travelDate} | {schedule.departureTime} to {schedule.arrivalTime}
                            </span>
                            <span>Fare: INR {schedule.fare}</span>
                            <span>Seats left: {schedule.availableSeats}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
}

export default BusListPage;
