import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { getStoredUser } from "../utils/auth";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const redirectPath = location.state?.from || "/search";
  const redirectState = location.state?.bookingState;

  const handleBackToLogin = () => {
    navigate("/login", {
      state: {
        from: redirectPath,
        bookingState: redirectState,
      },
    });
  };

  if (getStoredUser()) {
    return <Navigate to={redirectPath} state={redirectState} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await registerUser({
        ...formData,
        role: "USER",
      });
      navigate("/login", {
        replace: true,
        state: {
          from: redirectPath,
          bookingState: redirectState,
          registeredEmail: response.data.user?.email || formData.email,
          successMessage: "Registration successful. Please login to continue.",
        },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="button-row">
          <button className="btn btn-secondary" type="button" onClick={handleBackToLogin}>
            Back to Login
          </button>
        </div>
        <h1 className="page-title">Register</h1>
        <p className="muted-text">
          {redirectState
            ? "Create your account to continue this booking."
            : "Create your account to track bookings and manage cancellations."}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span className="form-label">Name</span>
            <input
              className="form-input"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </label>

          <label className="form-group">
            <span className="form-label">Email</span>
            <input
              className="form-input"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </label>

          <label className="form-group">
            <span className="form-label">Password</span>
            <div className="password-input-group">
              <input
                className="form-input"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                minLength={6}
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
