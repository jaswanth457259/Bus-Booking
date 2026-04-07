import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { getStoredUser, setStoredUser } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.registeredEmail || "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage] = useState(location.state?.successMessage || "");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const redirectPath = location.state?.from || "/search";
  const redirectState = location.state?.bookingState;

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
      const response = await loginUser(formData);
      setStoredUser(response.data.user);
      const destination =
        redirectState || redirectPath !== "/search"
          ? redirectPath
          : response.data.user?.role === "ADMIN"
            ? "/admin"
            : "/search";

      navigate(destination, { replace: true, state: redirectState });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="page-title">Login</h1>
        <p className="muted-text">
          {redirectState
            ? "Sign in to continue with your booking."
            : "Sign in to manage your bookings and continue faster next time."}
        </p>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form className="stack-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="form-footer">
          Do not have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
